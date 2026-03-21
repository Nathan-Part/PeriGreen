<?php

namespace App\DataFixtures;

use App\Entity\User;
use App\Enum\Role;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserFixtures extends Fixture
{
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        // Admin user
        $admin = new User();
        $admin->setEmail('admin@perigreen.fr');
        $admin->setFullName('System Admin');
        $admin->setUniversityId('ADMIN001');
        $admin->setRole(Role::ADMIN);
        $admin->setRoles(['ROLE_ADMIN']);
        $admin->setCreatedAt(new \DateTimeImmutable());
        $hashedPassword = $this->passwordHasher->hashPassword($admin, 'password');
        $admin->setPassword($hashedPassword);
        $manager->persist($admin);
        $this->addReference('user-admin', $admin);

        // Second admin user
        $admin2 = new User();
        $admin2->setEmail('admin2@perigreen.fr');
        $admin2->setFullName('Secondary Admin');
        $admin2->setUniversityId('ADMIN002');
        $admin2->setRole(Role::ADMIN);
        $admin2->setRoles(['ROLE_ADMIN']);
        $admin2->setCreatedAt(new \DateTimeImmutable());
        $hashedPassword = $this->passwordHasher->hashPassword($admin2, 'password');
        $admin2->setPassword($hashedPassword);
        $manager->persist($admin2);

        // Regular users
        for ($i = 1; $i <= 10; $i++) {
            $user = new User();
            $user->setEmail("user$i@student.fr");
            $user->setFullName("Student Name $i");
            $user->setUniversityId("STUD" . str_pad($i, 3, '0', STR_PAD_LEFT));
            $user->setRole(Role::USER);
            $user->setRoles(['ROLE_USER']);
            $user->setCreatedAt(new \DateTimeImmutable());
            $hashedPassword = $this->passwordHasher->hashPassword($user, 'password');
            $user->setPassword($hashedPassword);
            $manager->persist($user);
            $this->addReference("user-$i", $user);
        }

        $manager->flush();
    }
}
