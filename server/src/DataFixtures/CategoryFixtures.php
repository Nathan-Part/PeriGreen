<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\Category;

class CategoryFixtures extends Fixture
{
    public const CATEGORY_INFORMATIQUE = 'cat-informatique';
    public const CATEGORY_BRICOLAGE = 'cat-bricolage';
    public const CATEGORY_JARDINAGE = 'cat-jardinage';
    public const CATEGORY_SPORT = 'cat-sport';
    public const CATEGORY_CUISINE = 'cat-cuisine';

    public function load(ObjectManager $manager): void
    {
        $categories = [
            self::CATEGORY_INFORMATIQUE => ['name' => 'Informatique', 'description' => 'Matériel informatique, ordinateurs, périphériques, etc.'],
            self::CATEGORY_BRICOLAGE => ['name' => 'Bricolage', 'description' => 'Outils pour le bricolage, perceuses, scies, etc.'],
            self::CATEGORY_JARDINAGE => ['name' => 'Jardinage', 'description' => 'Outils pour le jardin, tondeuses, sécateurs, etc.'],
            self::CATEGORY_SPORT => ['name' => 'Sport', 'description' => 'Équipements sportifs, ballons, raquettes, etc.'],
            self::CATEGORY_CUISINE => ['name' => 'Cuisine', 'description' => 'Appareils de cuisine, mixeurs, robots, etc.'],
        ];

        foreach ($categories as $reference => $data) {
            $category = new Category();
            $category->setName($data['name']);
            $category->setDescription($data['description']);
            $manager->persist($category);
            $this->addReference($reference, $category);
        }

        $manager->flush();
    }
}
