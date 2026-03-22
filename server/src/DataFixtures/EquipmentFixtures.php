<?php

namespace App\DataFixtures;

use App\Entity\Category;
use App\Entity\Equipment;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class EquipmentFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $locations = ['Stock Bâtiment A', 'Salle IT 204', 'Armoire Réseau Hall', 'Bureau Technique', 'Réserves Biblio'];
        $etats = ['BON', 'USÉ', 'RECONDITIONNÉ'];
        $statuts = ['DISPONIBLE', 'EMPRUNTÉ', 'EN RÉPARATION'];

        $catalogue = [
            CategoryFixtures::CAT_SOURIS => [
                ['name' => 'Souris Optique Filaire', 'brand' => 'Logitech', 'model' => 'M100'],
                ['name' => 'Souris Silencieuse Sans-fil', 'brand' => 'Logitech', 'model' => 'M220'],
                ['name' => 'Souris Standard', 'brand' => 'Dell', 'model' => 'MS116'],
            ],
            CategoryFixtures::CAT_CLAVIER => [
                ['name' => 'Clavier Azerty USB', 'brand' => 'Logitech', 'model' => 'K120'],
                ['name' => 'Clavier Sans-fil Compact', 'brand' => 'Logitech', 'model' => 'K380'],
                ['name' => 'Clavier Standard Pro', 'brand' => 'Dell', 'model' => 'KB216'],
            ],
            CategoryFixtures::CAT_CABLE_HDMI => [
                ['name' => 'Câble HDMI 2m', 'brand' => 'Générique', 'model' => 'v2.0 Premium'],
                ['name' => 'Câble HDMI 5m', 'brand' => 'Amazon Basics', 'model' => 'High Speed'],
                ['name' => 'Câble Micro-HDMI vers HDMI', 'brand' => 'Ugreen', 'model' => 'Adapter Cable'],
            ],
            CategoryFixtures::CAT_CABLE_ETH => [
                ['name' => 'Câble Ethernet Cat6 1m', 'brand' => 'Générique', 'model' => 'Patch Cable'],
                ['name' => 'Câble Ethernet Cat6 3m', 'brand' => 'Générique', 'model' => 'Patch Cable'],
                ['name' => 'Câble Ethernet Blindé 10m', 'brand' => 'Legrand', 'model' => 'RJ45'],
            ],
            CategoryFixtures::CAT_ADAPT_USB => [
                ['name' => 'Adaptateur USB-C vers USB-A', 'brand' => 'Apple', 'model' => 'MJ1M2AM/A'],
                ['name' => 'Adaptateur USB-C vers Ethernet', 'brand' => 'Belkin', 'model' => 'Gigabit Adapter'],
            ],
            CategoryFixtures::CAT_ADAPT_HDMI => [
                ['name' => 'Adaptateur HDMI vers VGA', 'brand' => 'StarTech', 'model' => 'HD2VGAE2'],
                ['name' => 'Adaptateur Mini-DisplayPort vers HDMI', 'brand' => 'Générique', 'model' => 'Thunderbolt 2'],
            ],
            CategoryFixtures::CAT_HUB_USB => [
                ['name' => 'Hub USB 4 ports', 'brand' => 'Anker', 'model' => 'Ultra Slim'],
                ['name' => 'Hub USB-C 7-en-1', 'brand' => 'Ugreen', 'model' => 'Revodok'],
            ],
            CategoryFixtures::CAT_ECRAN => [
                ['name' => 'Écran 24 pouces Full HD', 'brand' => 'Dell', 'model' => 'P2422H'],
                ['name' => 'Écran 27 pouces 4K', 'brand' => 'LG', 'model' => 'UltraFine'],
                ['name' => 'Moniteur Portable 15"', 'brand' => 'Asus', 'model' => 'ZenScreen'],
            ],
            CategoryFixtures::CAT_CHARGEUR_PC => [
                ['name' => 'Chargeur USB-C 65W', 'brand' => 'Lenovo', 'model' => 'ThinkPad AC Adapter'],
                ['name' => 'Alimentation PC Portable 90W', 'brand' => 'HP', 'model' => 'Smart AC Adapter'],
                ['name' => 'Chargeur MagSafe 2', 'brand' => 'Apple', 'model' => '85W Power Adapter'],
            ],
            CategoryFixtures::CAT_CASQUE => [
                ['name' => 'Casque Micro Filaire', 'brand' => 'Logitech', 'model' => 'H340'],
                ['name' => 'Casque Antibruit Pro', 'brand' => 'Jabra', 'model' => 'Evolve 75'],
            ],
            CategoryFixtures::CAT_WEBCAM => [
                ['name' => 'Webcam Full HD 1080p', 'brand' => 'Logitech', 'model' => 'C920 HD Pro'],
                ['name' => 'Webcam Compacte 720p', 'brand' => 'Logitech', 'model' => 'C270'],
            ],
            CategoryFixtures::CAT_CLE_USB => [
                ['name' => 'Clé USB 3.0 32GB', 'brand' => 'SanDisk', 'model' => 'Ultra Flair'],
                ['name' => 'Clé USB 3.0 64GB', 'brand' => 'Kingston', 'model' => 'DataTraveler'],
            ],
            CategoryFixtures::CAT_MULTIPRISE => [
                ['name' => 'Bloc 5 prises + Interrupteur', 'brand' => 'Brennenstuhl', 'model' => 'Eco-Line'],
                ['name' => 'Multiprise Parafoudre', 'brand' => 'APC', 'model' => 'SurgeArrest'],
            ],
        ];

        $totalCount = 50;
        $allCategories = array_keys($catalogue);

        for ($i = 0; $i < $totalCount; $i++) {
            $catRef = $allCategories[$i % count($allCategories)];
            $items = $catalogue[$catRef];
            $itemData = $items[array_rand($items)];

            $equipment = new Equipment();
            $equipment->setName($itemData['name']);
            $equipment->setBrand($itemData['brand']);
            $equipment->setModel($itemData['model']);
            $equipment->setCategory($this->getReference($catRef, Category::class));
            
            $etat = $etats[array_rand($etats)];
            $equipment->setEtat($etat);
            
            // On gère les statuts avec une probabilité réaliste
            $randStatus = rand(0, 100);
            if ($randStatus < 70) {
                $status = 'DISPONIBLE';
            } elseif ($randStatus < 90) {
                $status = 'EMPRUNTÉ';
            } else {
                $status = 'EN RÉPARATION';
            }
            $equipment->setStatus($status);
            
            $equipment->setLocalisation($locations[array_rand($locations)]);
            
            $desc = match($etat) {
                'BON' => 'Fonctionne correctement, état proche du neuf.',
                'USÉ' => 'Légères traces d\'usure, parfaitement fonctionnel.',
                'RECONDITIONNÉ' => 'Reconditionné par le service IT, vérifié et testé.',
                default => 'Matériel vérifié par le service informatique.'
            };
            $equipment->setDescription($desc);
            
            $equipment->setSerialNumber("SN-" . strtoupper(substr($itemData['brand'], 0, 3)) . "-" . (10000 + $i));
            $equipment->setTotalQuantity(rand(1, 15));
            $equipment->setImageUrl("https://placehold.co/600x400?text=" . urlencode($itemData['name']));
            
            $manager->persist($equipment);
            $this->addReference("equipment-$i", $equipment);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            CategoryFixtures::class,
        ];
    }
}
