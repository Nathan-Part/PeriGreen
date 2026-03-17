<?php

namespace App\Controller;

use App\Entity\Loan;
use App\Entity\Reservation;
use App\Enum\LoanStatus;
use App\Enum\StatutReservation;
use App\Repository\EquipmentRepository;
use App\Repository\LoanRepository;
use App\Repository\ReservationRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

#[Route('/api/reservations', name: 'api_reservations_')]
class ReservationController extends AbstractController
{
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(ReservationRepository $repo): JsonResponse
    {
        if ($this->isGranted('ROLE_ADMIN')) {
            $reservations = $repo->findAll();
        } else {
            /** @var \App\Entity\User $user */
            $user = $this->getUser();
            $reservations = $repo->findBy(['requester' => $user]);
        }
        return $this->json(array_map(fn($r) => $this->format($r), $reservations));
    }

    #[Route('/me', name: 'my_reservations', methods: ['GET'])]
    public function getMyReservations(ReservationRepository $repo): JsonResponse
    {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['error' => 'Non authentifié'], 401);
        }

        $reservations = $repo->findBy(['requester' => $user]);
        return $this->json(array_map(fn($r) => $this->format($r), $reservations));
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(Reservation $reservation): JsonResponse
    {
        $user = $this->getUser();
        if (!$this->isGranted('ROLE_ADMIN') && $reservation->getRequester() !== $user) {
            throw new AccessDeniedException('Vous ne pouvez voir que vos propres réservations.');
        }
        return $this->json($this->format($reservation));
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $em,
        EquipmentRepository $equipmentRepo,
        UserRepository $userRepo,
        LoanRepository $loanRepo
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        // requesterId est implicite : c'est l'utilisateur connecté
        $required = ['quantity', 'equipmentId'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                return $this->json(['error' => "Champ manquant : $field"], 400);
            }
        }

        // Le statut d'une création de la part d'un user est forcé EN_ATTENTE
        // Si c'est un admin, il pourrait choisir, mais simplifions: on force EN_ATTENTE
        $status = StatutReservation::EN_ATTENTE;
        if (isset($data['status']) && $this->isGranted('ROLE_ADMIN')) {
            $parsedStatus = StatutReservation::tryFrom($data['status']);
            if ($parsedStatus) {
                $status = $parsedStatus;
            }
        }

        $equipment = $equipmentRepo->find($data['equipmentId']);
        if (!$equipment) return $this->json(['error' => 'Équipement introuvable'], 404);

        /** @var \App\Entity\User $requester */
        $requester = $this->getUser();
        if (!$requester) return $this->json(['error' => 'Utilisateur introuvable ou non authentifié'], 401);

        // Si l'admin passe un requesterId, on crée la réservation au nom de cet utilisateur
        if (isset($data['requesterId']) && $this->isGranted('ROLE_ADMIN')) {
            $targetUser = $userRepo->find($data['requesterId']);
            if (!$targetUser) return $this->json(['error' => 'Utilisateur cible introuvable'], 404);
            $requester = $targetUser;
        }

        $reservation = new Reservation();
        $reservation->setCreatedAt(new \DateTimeImmutable());
        $reservation->setStatus($status->value);
        $reservation->setQuantity((int) $data['quantity']);
        $reservation->setEquipment($equipment);
        $reservation->setRequester($requester);

        if (isset($data['approverId']) && $this->isGranted('ROLE_ADMIN')) {
            $approver = $userRepo->find($data['approverId']);
            if (!$approver) return $this->json(['error' => 'Approbateur introuvable'], 404);
            $reservation->setApprover($approver);
        }

        if (isset($data['validatedAt']) && $this->isGranted('ROLE_ADMIN')) {
            $reservation->setValidatedAt(new \DateTimeImmutable($data['validatedAt']));
        }

        if (isset($data['decisionNote']) && $this->isGranted('ROLE_ADMIN')) {
            $reservation->setDecisionNote($data['decisionNote']);
        }

        $em->persist($reservation);
        $em->flush();

        // ── Création automatique du Loan si statut = VALIDEE directement ──
        if ($status === StatutReservation::VALIDEE && $this->isGranted('ROLE_ADMIN')) {
            if (!$reservation->getValidatedAt()) {
                $reservation->setValidatedAt(new \DateTimeImmutable());
            }
            /** @var \App\Entity\User $admin */
            $admin = $this->getUser();
            if (!$reservation->getApprover()) {
                $reservation->setApprover($admin);
            }

            $dueDate = isset($data['dueDate'])
                ? new \DateTimeImmutable($data['dueDate'])
                : new \DateTimeImmutable('+30 days');

            $loan = new Loan();
            $loan->setPickupDate(new \DateTimeImmutable());
            $loan->setDueDate($dueDate);
            $loan->setStatus(LoanStatus::EN_COURS);
            $loan->setQuantity($reservation->getQuantity());
            $loan->setEquipment($reservation->getEquipment());
            $loan->setBorrower($reservation->getRequester());
            $loan->setReservation($reservation);

            $em->persist($loan);
            $em->flush();
        }

        return $this->json($this->format($reservation), 201);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function update(
        Reservation $reservation,
        Request $request,
        EntityManagerInterface $em,
        EquipmentRepository $equipmentRepo,
        UserRepository $userRepo,
        LoanRepository $loanRepo
    ): JsonResponse {
        $user = $this->getUser();
        $isAdmin = $this->isGranted('ROLE_ADMIN');

        if (!$isAdmin && $reservation->getRequester() !== $user) {
            throw new AccessDeniedException('Vous ne pouvez modifier que vos propres réservations.');
        }

        $data = json_decode($request->getContent(), true);

        // Un user standard ne peut modifier que la quantité et s'il est en attente
        if (!$isAdmin && $reservation->getStatus() !== StatutReservation::EN_ATTENTE->value) {
            return $this->json(['error' => 'Vous ne pouvez plus modifier cette réservation.'], 403);
        }

        if (isset($data['quantity']))    $reservation->setQuantity((int) $data['quantity']);

        $previousStatus = $reservation->getStatus();

        // Seul l'admin peut modifier ces champs
        if ($isAdmin) {
            if (isset($data['decisionNote'])) $reservation->setDecisionNote($data['decisionNote']);
            if (isset($data['validatedAt'])) $reservation->setValidatedAt(new \DateTimeImmutable($data['validatedAt']));

            if (isset($data['status'])) {
                $status = StatutReservation::tryFrom($data['status']);
                if (!$status) return $this->json(['error' => 'Statut invalide'], 400);
                $reservation->setStatus($status->value);
            }

            if (isset($data['requesterId'])) {
                $requester = $userRepo->find($data['requesterId']);
                if (!$requester) return $this->json(['error' => 'Utilisateur introuvable'], 404);
                $reservation->setRequester($requester);
            }

            if (isset($data['approverId'])) {
                $approver = $userRepo->find($data['approverId']);
                if (!$approver) return $this->json(['error' => 'Approbateur introuvable'], 404);
                $reservation->setApprover($approver);
            }
        }

        if (isset($data['equipmentId'])) {
            $equipment = $equipmentRepo->find($data['equipmentId']);
            if (!$equipment) return $this->json(['error' => 'Équipement introuvable'], 404);
            $reservation->setEquipment($equipment);
        }

        // ── Création automatique du Loan quand la réservation est validée ──
        if (
            $isAdmin
            && $reservation->getStatus() === StatutReservation::VALIDEE->value
            && $previousStatus !== StatutReservation::VALIDEE->value
            && $loanRepo->findOneBy(['reservation' => $reservation]) === null
        ) {
            // validatedAt = maintenant si pas déjà défini
            if (!$reservation->getValidatedAt()) {
                $reservation->setValidatedAt(new \DateTimeImmutable());
            }

            // Approver = admin connecté si pas encore défini
            /** @var \App\Entity\User $admin */
            $admin = $this->getUser();
            if (!$reservation->getApprover()) {
                $reservation->setApprover($admin);
            }

            $dueDate = isset($data['dueDate'])
                ? new \DateTimeImmutable($data['dueDate'])
                : new \DateTimeImmutable('+30 days');

            $loan = new Loan();
            $loan->setPickupDate(new \DateTimeImmutable());
            $loan->setDueDate($dueDate);
            $loan->setStatus(LoanStatus::EN_COURS);
            $loan->setQuantity($reservation->getQuantity());
            $loan->setEquipment($reservation->getEquipment());
            $loan->setBorrower($reservation->getRequester());
            $loan->setReservation($reservation);

            $em->persist($loan);
        }

        $em->flush();
        return $this->json($this->format($reservation));
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(Reservation $reservation, EntityManagerInterface $em): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $em->remove($reservation);
        $em->flush();
        return $this->json(['message' => 'Réservation supprimée'], 200);
    }

    private function format(Reservation $r): array
    {
        return [
            'id'           => $r->getId(),
            'createdAt'    => $r->getCreatedAt()?->format('Y-m-d H:i:s'),
            'status'       => $r->getStatus(),
            'quantity'     => $r->getQuantity(),
            'validatedAt'  => $r->getValidatedAt()?->format('Y-m-d H:i:s'),
            'decisionNote' => $r->getDecisionNote(),
            'equipment'    => [
                'id'   => $r->getEquipment()->getId(),
                'name' => $r->getEquipment()->getName(),
            ],
            'requester'    => [
                'id'    => $r->getRequester()->getId(),
                'email' => $r->getRequester()->getEmail(),
            ],
            'approver'     => $r->getApprover() ? [
                'id'    => $r->getApprover()->getId(),
                'email' => $r->getApprover()->getEmail(),
            ] : null,
        ];
    }
}