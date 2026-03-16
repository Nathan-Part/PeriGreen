<?php

namespace App\Controller;

use App\Entity\Loan;
use App\Enum\LoanStatus;
use App\Repository\EquipmentRepository;
use App\Repository\LoanRepository;
use App\Repository\ReservationRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/loans', name: 'api_loans_')]
class LoanController extends AbstractController
{
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(LoanRepository $repo): JsonResponse
    {
        $loans = $repo->findAll();
        return $this->json(array_map(fn($l) => $this->format($l), $loans));
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(Loan $loan): JsonResponse
    {
        return $this->json($this->format($loan));
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $em,
        EquipmentRepository $equipmentRepo,
        UserRepository $userRepo,
        ReservationRepository $reservationRepo
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $required = ['pickupDate', 'dueDate', 'status', 'quantity', 'reservationId', 'equipmentId', 'borrowerId'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                return $this->json(['error' => "Champ manquant : $field"], 400);
            }
        }

        $status = LoanStatus::tryFrom($data['status']);
        if (!$status) {
            return $this->json(['error' => 'Statut invalide. Valeurs: EN_COURS, RETOUR_DEMANDE, TERMINE, EN_RETARD'], 400);
        }

        $equipment = $equipmentRepo->find($data['equipmentId']);
        if (!$equipment) return $this->json(['error' => 'Équipement introuvable'], 404);

        $borrower = $userRepo->find($data['borrowerId']);
        if (!$borrower) return $this->json(['error' => 'Utilisateur introuvable'], 404);

        $reservation = $reservationRepo->find($data['reservationId']);
        if (!$reservation) return $this->json(['error' => 'Réservation introuvable'], 404);

        $loan = new Loan();
        $loan->setPickupDate(new \DateTimeImmutable($data['pickupDate']));
        $loan->setDueDate(new \DateTimeImmutable($data['dueDate']));
        $loan->setReturnDate(isset($data['returnDate']) ? new \DateTimeImmutable($data['returnDate']) : null);
        $loan->setStatus($status);
        $loan->setQuantity((int) $data['quantity']);
        if (isset($data['returnNote'])) {
            $loan->setReturnNote($data['returnNote']);
        }
        $loan->setEquipment($equipment);
        $loan->setBorrower($borrower);
        $loan->setReservation($reservation);

        $em->persist($loan);
        $em->flush();

        return $this->json($this->format($loan), 201);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function update(
        Loan $loan,
        Request $request,
        EntityManagerInterface $em,
        EquipmentRepository $equipmentRepo,
        UserRepository $userRepo,
        ReservationRepository $reservationRepo
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (isset($data['pickupDate']))  $loan->setPickupDate(new \DateTimeImmutable($data['pickupDate']));
        if (isset($data['dueDate']))     $loan->setDueDate(new \DateTimeImmutable($data['dueDate']));
        if (isset($data['returnDate']))  $loan->setReturnDate(new \DateTimeImmutable($data['returnDate']));
        if (isset($data['quantity']))    $loan->setQuantity((int) $data['quantity']);
        if (isset($data['returnNote']))  $loan->setReturnNote($data['returnNote']);

        if (isset($data['status'])) {
            $status = LoanStatus::tryFrom($data['status']);
            if (!$status) return $this->json(['error' => 'Statut invalide'], 400);
            $loan->setStatus($status);
        }

        if (isset($data['equipmentId'])) {
            $equipment = $equipmentRepo->find($data['equipmentId']);
            if (!$equipment) return $this->json(['error' => 'Équipement introuvable'], 404);
            $loan->setEquipment($equipment);
        }

        if (isset($data['borrowerId'])) {
            $borrower = $userRepo->find($data['borrowerId']);
            if (!$borrower) return $this->json(['error' => 'Utilisateur introuvable'], 404);
            $loan->setBorrower($borrower);
        }

        if (isset($data['reservationId'])) {
            $reservation = $reservationRepo->find($data['reservationId']);
            if (!$reservation) return $this->json(['error' => 'Réservation introuvable'], 404);
            $loan->setReservation($reservation);
        }

        $em->flush();
        return $this->json($this->format($loan));
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(Loan $loan, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($loan);
        $em->flush();
        return $this->json(['message' => 'Prêt supprimé'], 200);
    }

    private function format(Loan $l): array
    {
        return [
            'id'          => $l->getId(),
            'pickupDate'  => $l->getPickupDate()?->format('Y-m-d'),
            'dueDate'     => $l->getDueDate()?->format('Y-m-d'),
            'returnDate'  => $l->getReturnDate()?->format('Y-m-d'),
            'status'      => $l->getStatus()?->value,
            'quantity'    => $l->getQuantity(),
            'returnNote'  => $l->getReturnNote(),
            'equipment'   => [
                'id'   => $l->getEquipment()->getId(),
                'name' => $l->getEquipment()->getName(),
            ],
            'borrower'    => [
                'id'    => $l->getBorrower()->getId(),
                'email' => $l->getBorrower()->getEmail(),
            ],
            'reservation' => [
                'id' => $l->getReservation()->getId(),
            ],
        ];
    }
}