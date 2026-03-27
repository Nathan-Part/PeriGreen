<?php

namespace App\Controller;

use App\Entity\User;
use App\Enum\Role;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/auth')]
final class AuthController extends AbstractController
{
    #[Route('/register', name: 'app_auth_register', methods: ['POST'])]
    public function register(
        Request $request,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $em,
        UserRepository $userRepository
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (empty($data['email']) || empty($data['password']) || empty($data['fullName']) || empty($data['universityId'])) {
            return $this->json(['error' => 'Champs manquants'], 400);
        }

        if ($userRepository->findOneBy(['email' => $data['email']])) {
            return $this->json(['error' => 'Email deja utilise'], 409);
        }

        if (($data['cguAccepted'] ?? false) !== true || ($data['privacyAccepted'] ?? false) !== true) {
            return $this->json(['error' => 'Vous devez accepter les CGU et la politique RGPD'], 400);
        }

        $acceptedAt = new \DateTimeImmutable();

        $user = new User();
        $user->setEmail($data['email']);
        $user->setFullName($data['fullName']);
        $user->setUniversityId($data['universityId']);
        $user->setRole(Role::USER);
        $user->setRoles(['ROLE_USER']);
        $user->setCreatedAt($acceptedAt);
        $user->setCguAcceptedAt($acceptedAt);
        $user->setPrivacyAcceptedAt($acceptedAt);
        $user->setPassword($passwordHasher->hashPassword($user, $data['password']));

        $em->persist($user);
        $em->flush();

        return $this->json(['message' => 'Compte cree avec succes'], 201);
    }

    #[Route('/login', name: 'app_auth_login', methods: ['POST'])]
    public function login(): JsonResponse
    {
        throw new \Exception('Cette route est geree par security.yaml');
    }

    #[Route('/forgot-password', name: 'app_auth_forgot_password', methods: ['POST'])]
    public function forgotPassword(
        Request $request,
        EntityManagerInterface $em,
        UserRepository $userRepository,
        MailerInterface $mailer
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $email = isset($data['email']) ? trim((string) $data['email']) : '';

        if ($email === '') {
            return $this->json(['error' => 'Email requis'], 400);
        }

        $message = 'Si un compte existe avec cet email, un lien de reinitialisation a ete genere.';
        $user = $userRepository->findOneBy(['email' => $email]);

        if (!$user) {
            return $this->json(['message' => $message], 200);
        }

        $plainToken = bin2hex(random_bytes(32));
        $hashedToken = hash('sha256', $plainToken);
        $expiresAt = new \DateTimeImmutable('+1 hour');
        $frontendUrl = rtrim($_ENV['FRONTEND_URL'] ?? 'http://localhost:5173', '/');

        $user->setResetPasswordToken($hashedToken);
        $user->setResetPasswordExpiresAt($expiresAt);
        $em->flush();

        $resetUrl = sprintf('%s/reset-password?token=%s', $frontendUrl, $plainToken);

        $emailMessage = (new Email())
            ->from($_ENV['MAILER_FROM'] ?? 'noreply@perigreen.local')
            ->to($user->getEmail() ?? $email)
            ->subject('PeriGreen - Reinitialisation de votre mot de passe')
            ->text(
                "Bonjour,\n\n"
                . "Une demande de reinitialisation de mot de passe a ete effectuee pour votre compte PeriGreen.\n"
                . "Utilisez ce lien dans l'heure : {$resetUrl}\n\n"
                . "Si vous n'etes pas a l'origine de cette demande, ignorez simplement cet email.\n\n"
                . "L'equipe PeriGreen"
            )
            ->html(sprintf(
                '<p>Bonjour,</p><p>Une demande de reinitialisation de mot de passe a ete effectuee pour votre compte PeriGreen.</p><p><a href="%1$s">Reinitialiser mon mot de passe</a></p><p>Ce lien expire le %2$s.</p><p>Si vous n etes pas a l origine de cette demande, ignorez simplement cet email.</p><p>L equipe PeriGreen</p>',
                htmlspecialchars($resetUrl, ENT_QUOTES),
                $expiresAt->format('d/m/Y H:i')
            ));

        try {
            $mailer->send($emailMessage);
        } catch (TransportExceptionInterface) {
            return $this->json(['error' => 'Impossible d envoyer l email de reinitialisation'], 500);
        }

        return $this->json([
            'message' => $message,
            'resetUrl' => ($_ENV['APP_ENV'] ?? 'dev') === 'prod' ? null : $resetUrl,
            'expiresAt' => $expiresAt->format(DATE_ATOM),
        ], 200);
    }

    #[Route('/reset-password', name: 'app_auth_reset_password', methods: ['POST'])]
    public function resetPassword(
        Request $request,
        EntityManagerInterface $em,
        UserRepository $userRepository,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $plainToken = isset($data['token']) ? trim((string) $data['token']) : '';
        $password = isset($data['password']) ? (string) $data['password'] : '';

        if ($plainToken === '' || $password === '') {
            return $this->json(['error' => 'Token et mot de passe requis'], 400);
        }

        if (mb_strlen($password) < 8) {
            return $this->json(['error' => 'Le mot de passe doit contenir au moins 8 caracteres'], 400);
        }

        $user = $userRepository->findOneByResetPasswordToken(hash('sha256', $plainToken));
        if (!$user) {
            return $this->json(['error' => 'Lien de reinitialisation invalide ou expire'], 400);
        }

        $user->setPassword($passwordHasher->hashPassword($user, $password));
        $user->setResetPasswordToken(null);
        $user->setResetPasswordExpiresAt(null);
        $em->flush();

        return $this->json(['message' => 'Mot de passe mis a jour avec succes'], 200);
    }

    #[Route('/me', name: 'app_auth_me', methods: ['GET'])]
    public function me(Request $request): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'Unauthorized'], 401);
        }

        $data = [
            'id' => $user->getId(),
            'email' => $user->getUserIdentifier(),
            'roles' => $user->getRoles(),
            'fullName' => method_exists($user, 'getFullName') ? $user->getFullName() : null,
            'universityId' => method_exists($user, 'getUniversityId') ? $user->getUniversityId() : null,
            'cguAcceptedAt' => method_exists($user, 'getCguAcceptedAt') && $user->getCguAcceptedAt() ? $user->getCguAcceptedAt()->format(DATE_ATOM) : null,
            'privacyAcceptedAt' => method_exists($user, 'getPrivacyAcceptedAt') && $user->getPrivacyAcceptedAt() ? $user->getPrivacyAcceptedAt()->format(DATE_ATOM) : null,
        ];

        $response = new JsonResponse($data);
        $response->setEtag(md5(serialize($data)));
        $response->setPrivate();
        $response->isNotModified($request);

        return $response;
    }
}
