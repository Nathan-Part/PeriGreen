import { Benefits } from '../components/home/Benefits';
import { CTA } from '../components/home/CTA';
import { Features } from '../components/home/Features';
import { Hero } from '../components/home/Hero';
import { Impact } from '../components/home/Impact';
import { Mission } from '../components/home/Mission';
import { Processus } from '../components/home/Processus';
import { Team } from '../components/home/Team';
import { Testimonials } from '../components/home/Testimonials';

export default function Home() {
    return (
        <div id="top">
                {/* Section Hero */}
                <Hero />

                {/* Section Mission */}
                <Mission />

                {/* Section Fonctionnalités */}
                <Features />

                {/* Section Bénéfices */}
                <Benefits />

                {/* Section Processus / Parcours utilisateur */}
                <Processus />

                {/* Section Impact */}
                <Impact />

                {/* Section Témoignages étudiants */}
                <Testimonials />

                {/* Section Call To Action */}
                <CTA />

                {/* Section Équipe projet */}
                <Team />
        </div>
    );
}
