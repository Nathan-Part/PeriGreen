<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\Category;

class CategoryFixtures extends Fixture
{
    public const CAT_SOURIS = 'cat-souris';
    public const CAT_CLAVIER = 'cat-clavier';
    public const CAT_CABLE_HDMI = 'cat-cable-hdmi';
    public const CAT_CABLE_ETH = 'cat-cable-eth';
    public const CAT_ADAPT_USB = 'cat-adapt-usb';
    public const CAT_ADAPT_HDMI = 'cat-adapt-hdmi';
    public const CAT_HUB_USB = 'cat-hub-usb';
    public const CAT_ECRAN = 'cat-ecran';
    public const CAT_CHARGEUR_PC = 'cat-chargeur-pc';
    public const CAT_CASQUE = 'cat-casque';
    public const CAT_WEBCAM = 'cat-webcam';
    public const CAT_CLE_USB = 'cat-cle-usb';
    public const CAT_MULTIPRISE = 'cat-multiprise';

    public function load(ObjectManager $manager): void
    {
        $categories = [
            self::CAT_SOURIS => ['name' => 'Souris', 'description' => 'Souris filaires et sans-fil.'],
            self::CAT_CLAVIER => ['name' => 'Clavier', 'description' => 'Claviers USB et Bluetooth.'],
            self::CAT_CABLE_HDMI => ['name' => 'Câble HDMI', 'description' => 'Câbles de liaison vidéo.'],
            self::CAT_CABLE_ETH => ['name' => 'Câble Ethernet', 'description' => 'Câbles réseau RJ45.'],
            self::CAT_ADAPT_USB => ['name' => 'Adaptateur USB', 'description' => 'Adaptateurs USB-C vers USB-A, etc.'],
            self::CAT_ADAPT_HDMI => ['name' => 'Adaptateur HDMI', 'description' => 'Adaptateurs vidéo divers.'],
            self::CAT_HUB_USB => ['name' => 'Hub USB', 'description' => 'Multiplicateurs de ports USB.'],
            self::CAT_ECRAN => ['name' => 'Écran', 'description' => 'Moniteurs et dalles portables.'],
            self::CAT_CHARGEUR_PC => ['name' => 'Chargeur PC', 'description' => 'Alimentations pour portables.'],
            self::CAT_CASQUE => ['name' => 'Casque audio', 'description' => 'Casques et écouteurs.'],
            self::CAT_WEBCAM => ['name' => 'Webcam', 'description' => 'Caméras USB pour visio.'],
            self::CAT_CLE_USB => ['name' => 'Clé USB', 'description' => 'Supports de stockage flash.'],
            self::CAT_MULTIPRISE => ['name' => 'Multiprise', 'description' => 'Blocs électriques.'],
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
