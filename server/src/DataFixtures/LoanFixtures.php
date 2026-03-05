<?php

namespace App\DataFixtures;

use App\Entity\Reservation;
use App\Entity\Loan;
use App\Enum\LoanStatus;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class LoanFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $loanStatuses = [LoanStatus::EN_COURS, LoanStatus::TERMINE];
        $j = 0;

        for ($i = 0; $i < 15; $i++) {
            $reservation = $this->getReference("reservation-$i", Reservation::class);

            // Only create loans for validated reservations
            if ($reservation->getStatus() === 'VALIDATED') {
                $loan = new Loan();
                $loan->setReservation($reservation);
                $loan->setEquipment($reservation->getEquipment());
                $loan->setBorrower($reservation->getRequester());
                $loan->setQuantity($reservation->getQuantity());
                
                $pickupDate = $reservation->getValidatedAt()->modify('+' . rand(1, 3) . ' days');
                $loan->setPickupDate($pickupDate);
                $loan->setDueDate($pickupDate->modify('+7 days'));

                $status = $loanStatuses[array_rand($loanStatuses)];
                $loan->setStatus($status);

                if ($status === LoanStatus::TERMINE) {
                    $loan->setReturnDate($loan->getDueDate()->modify('-' . rand(0, 2) . ' days'));
                    $loan->setReturnNote("Matériel rendu en bon état. Prêt $j.");
                }

                $manager->persist($loan);
                $j++;
            }
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            ReservationFixtures::class,
        ];
    }
}
