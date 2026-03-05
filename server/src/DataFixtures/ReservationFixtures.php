<?php

namespace App\DataFixtures;

use App\Entity\User;
use App\Entity\Equipment;
use App\Entity\Reservation;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class ReservationFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $statuses = ['PENDING', 'VALIDATED', 'REJECTED'];
        $admin = $this->getReference('user-admin', User::class);

        for ($i = 0; $i < 15; $i++) {
            $userRef = 'user-' . rand(1, 10);
            $equipmentRef = 'equipment-' . rand(0, 15);

            $reservation = new Reservation();
            $reservation->setRequester($this->getReference($userRef, User::class));
            $reservation->setEquipment($this->getReference($equipmentRef, Equipment::class));
            $reservation->setQuantity(rand(1, 2));
            $reservation->setCreatedAt(\DateTimeImmutable::createFromMutable((new \DateTime())->modify("-$i days")));
            
            $status = $statuses[array_rand($statuses)];
            $reservation->setStatus($status);

            if ($status !== 'PENDING') {
                $reservation->setApprover($admin);
                $reservation->setValidatedAt(\DateTimeImmutable::createFromMutable((new \DateTime())->modify("-" . rand(0, $i) . " days")));
                if ($status === 'REJECTED') {
                    $reservation->setDecisionNote("Raison du refus pour la réservation $i.");
                } else {
                    $reservation->setDecisionNote("Accepté par l'admin.");
                }
            }

            $manager->persist($reservation);
            $this->addReference("reservation-$i", $reservation);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            UserFixtures::class,
            EquipmentFixtures::class,
        ];
    }
}
