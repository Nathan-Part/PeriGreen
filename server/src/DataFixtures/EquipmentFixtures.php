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
        $data = [
            [
                'category' => CategoryFixtures::CATEGORY_INFORMATIQUE,
                'items' => [
                    ['name' => 'MacBook Pro', 'brand' => 'Apple', 'model' => 'M3 2024'],
                    ['name' => 'Dell XPS 15', 'brand' => 'Dell', 'model' => 'XPS 9530'],
                    ['name' => 'Logitech MX Master 3', 'brand' => 'Logitech', 'model' => 'MX Master 3S'],
                    ['name' => 'Écran 4K LG', 'brand' => 'LG', 'model' => '27UK850'],
                ]
            ],
            [
                'category' => CategoryFixtures::CATEGORY_BRICOLAGE,
                'items' => [
                    ['name' => 'Perceuse à percussion', 'brand' => 'Bosch', 'model' => 'PSB 18 LI-2'],
                    ['name' => 'Marteau perforateur', 'brand' => 'Makita', 'model' => 'HR2470'],
                    ['name' => 'Scie sauteuse', 'brand' => 'Dewalt', 'model' => 'DCS334N'],
                ]
            ],
            [
                'category' => CategoryFixtures::CATEGORY_JARDINAGE,
                'items' => [
                    ['name' => 'Tondeuse à gazon', 'brand' => 'Honda', 'model' => 'HRG 466 SK'],
                    ['name' => 'Sécateur électrique', 'brand' => 'Stihl', 'model' => 'ASA 85'],
                    ['name' => 'Coupe-bordure', 'brand' => 'Black+Decker', 'model' => 'GL9035'],
                ]
            ],
            [
                'category' => CategoryFixtures::CATEGORY_SPORT,
                'items' => [
                    ['name' => 'VTT Electrique', 'brand' => 'Specialized', 'model' => 'Turbo Levo'],
                    ['name' => 'Raquette de Tennis', 'brand' => 'Babolat', 'model' => 'Pure Drive'],
                    ['name' => 'Ballon de Basket', 'brand' => 'Wilson', 'model' => 'Evolution'],
                ]
            ],
            [
                'category' => CategoryFixtures::CATEGORY_CUISINE,
                'items' => [
                    ['name' => 'Thermomix', 'brand' => 'Vorwerk', 'model' => 'TM6'],
                    ['name' => 'Machine à Café', 'brand' => 'DeLonghi', 'model' => 'Magnifica S'],
                    ['name' => 'Robot Pâtissier', 'brand' => 'KitchenAid', 'model' => 'Artisan'],
                ]
            ],
        ];

        $i = 0;
        foreach ($data as $catGroup) {
            $category = $this->getReference($catGroup['category'], Category::class);
            foreach ($catGroup['items'] as $itemData) {
                $equipment = new Equipment();
                $equipment->setName($itemData['name']);
                $equipment->setBrand($itemData['brand']);
                $equipment->setModel($itemData['model']);
                $equipment->setCategory($category);
                $equipment->setDescription("Description pour " . $itemData['name']);
                $equipment->setSerialNumber("SN-" . strtoupper(substr($itemData['brand'], 0, 3)) . "-" . rand(1000, 9999));
                $equipment->setEtat("Neuf");
                $equipment->setTotalQuantity(rand(1, 5));
                $equipment->setImageUrl("https://placehold.co/600x400?text=" . urlencode($itemData['name']));
                
                $manager->persist($equipment);
                $this->addReference("equipment-$i", $equipment);
                $i++;
            }
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
