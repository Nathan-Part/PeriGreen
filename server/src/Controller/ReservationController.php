<?php

namespace App\Controller;

use App\Entity\Reservation;
use App\Enum\StatutReservation;
use App\Repository\EquipmentRepository;
use App\Repository\ReservationRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/reservations', name: 'api_reservations_')]
class ReservationController extends AbstractController
{
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(ReservationRepository $repo): JsonResponse
    {
        return $this->json(array_map(fn($r) => $this->format($r), $repo->findAll()));
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(Reservation $reservation): JsonResponse
    {
        return $this->json($this->format($reservation));
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $em,
        EquipmentRepository $equipmentRepo,
        UserRepository $userRepo
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $required = ['quantity', 'status', 'equipmentId', 'requesterId'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                return $this->json(['error' => "Champ manquant : $field"], 400);
            }
        }

        $status = StatutReservation::tryFrom($data['status']);
        if (!$status) {
            return $this->json(['error' => 'Statut invalide. Valeurs: EN_ATTENTE, VALIDEE, REFUSEE, ANNULEE, EXPIREE'], 400);
        }

        $equipment = $equipmentRepo->find($data['equipmentId']);
        if (!$equipment) return $this->json(['error' => 'Équipement introuvable'], 404);

        $requester = $userRepo->find($data['requesterId']);
        if (!$requester) return $this->json(['error' => 'Utilisateur introuvable'], 404);

        $reservation = new Reservation();
        $reservation->setCreatedAt(new \DateTimeImmutable());
        $reservation->setStatus($status->value);
        $reservation->setQuantity((int) $data['quantity']);
        $reservation->setEquipment($equipment);
        $reservation->setRequester($requester);

        if (isset($data['approverId'])) {
            $approver = $userRepo->find($data['approverId']);
            if (!$approver) return $this->json(['error' => 'Approbateur introuvable'], 404);
            $reservation->setApprover($approver);
        }

        if (isset($data['validatedAt'])) {
            $reservation->setValidatedAt(new \DateTimeImmutable($data['validatedAt']));
        }

        if (isset($data['decisionNote'])) {
            $reservation->setDecisionNote($data['decisionNote']);
        }

        $em->persist($reservation);
        $em->flush();

        return $this->json($this->format($reservation), 201);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function update(
        Reservation $reservation,
        Request $request,
        EntityManagerInterface $em,
        EquipmentRepository $equipmentRepo,
        UserRepository $userRepo
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (isset($data['quantity']))    $reservation->setQuantity((int) $data['quantity']);
        if (isset($data['decisionNote'])) $reservation->setDecisionNote($data['decisionNote']);
        if (isset($data['validatedAt'])) $reservation->setValidatedAt(new \DateTimeImmutable($data['validatedAt']));

        if (isset($data['status'])) {
            $status = StatutReservation::tryFrom($data['status']);
            if (!$status) return $this->json(['error' => 'Statut invalide'], 400);
            $reservation->setStatus($status->value);
        }

        if (isset($data['equipmentId'])) {
            $equipment = $equipmentRepo->find($data['equipmentId']);
            if (!$equipment) return $this->json(['error' => 'Équipement introuvable'], 404);
            $reservation->setEquipment($equipment);
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

        $em->flush();
        return $this->json($this->format($reservation));
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(Reservation $reservation, EntityManagerInterface $em): JsonResponse
    {
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