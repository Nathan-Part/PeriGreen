<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\Category;

class CategoryFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $product = new Category();
        $product->setName('Informatique');
        $product->setDescription('Matériel informatique, ordinateurs, périphériques, etc.');
        $manager->persist($product);

        $manager->flush();
    }
}
