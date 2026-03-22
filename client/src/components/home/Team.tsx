import { BriefcaseBusiness, Globe, Leaf, Users } from 'lucide-react';

const teamMembers = [
    {
        name: 'Yacine El Hamel',
        role: 'Chef de projet',
        description: "Il pilote la vision et s'assure que chaque décision sert la durabilité.",
        meta: ['Produit', 'Campus', 'Impact'],
    },
    {
        name: 'Christophe MAGNY',
        role: 'Responsable conformité',
        description: "Il orchestre les sprints en gardant l'impact environnemental en ligne de mire.",
        meta: ['Cadre', 'Suivi', 'Qualité'],
    },
    {
        name: 'Jacques-Henri VOLLET',
        role: 'Tech lead',
        description: "Il trace la route technique en pensant à l'efficacité énergétique du code.",
        meta: ['Tech', 'Produit', 'UX'],
    },
    {
        name: 'Nathan PARTOUCHE',
        role: 'Développeur backend',
        description: 'Il code les moteurs invisibles qui font tourner PERIGREEN sans gaspillage.',
        meta: ['API', 'Données', 'Flux'],
    },
    {
        name: 'Halison ANDRIANAIVOARIVELO',
        role: 'Développeur frontend',
        description: 'Il façonne l’interface que les étudiants utilisent pour partager responsablement.',
        meta: ['Interface', 'Design', 'Usage'],
    },
    {
        name: 'Youssef badri',
        role: 'Développeur frontend',
        description: 'Il navigue entre frontend et backend en pensant à l’empreinte carbone.',
        meta: ['UI', 'Responsive', 'Cohérence'],
    },
    {
        name: 'CAMARA Sihya',
        role: 'Développeuse full stack',
        description: 'Code et environnement sont ses deux passions qui se rencontrent ici.',
        meta: ['Parcours', 'Produit', 'Tests'],
    },
];

const icons = [Leaf, Users, BriefcaseBusiness, Globe];

export function Team() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-10 pb-16 sm:px-6 lg:px-8">
            <div className="rounded-[2rem] border border-[#2f8f6b]/10 bg-white/78 p-8 shadow-sm lg:p-10">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#2f8f6b]">Équipe</p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0f3d2e]">Ceux qui construisent</h2>
                    <p className="mt-3 text-sm leading-7 text-[#1b5e4b]">
                        Des portraits du projet mené par une conviction commune.
                    </p>
                </div>

                <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {teamMembers.map((member, index) => {
                        const Icon = icons[index % icons.length];

                        return (
                            <article
                                key={member.name}
                                className="rounded-[1.5rem] border border-[#2f8f6b]/10 bg-[#f9fdfb] p-5 text-center"
                            >
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e6f5ef] text-[#2f8f6b]">
                                    <Icon size={22} />
                                </div>
                                <h3 className="mt-4 text-base font-bold text-[#0f3d2e]">{member.name}</h3>
                                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#2f8f6b]">
                                    {member.role}
                                </p>
                                <p className="mt-3 text-sm leading-6 text-[#1b5e4b]">{member.description}</p>
                                <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-[#5a776a]">
                                    {member.meta.map((item) => (
                                        <span
                                            key={item}
                                            className="rounded-full border border-[#2f8f6b]/10 bg-white px-2.5 py-1"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </article>
                        );
                    })}
                </div>

                <div className="mx-auto mt-10 max-w-xl rounded-[1.75rem] border border-[#2f8f6b]/10 bg-[#f4fbf7] px-6 py-8 text-center">
                    <h3 className="text-2xl font-bold text-[#0f3d2e]">Nous recrutons</h3>
                    <p className="mt-3 text-sm leading-7 text-[#1b5e4b]">
                        Rejoignez notre équipe pour construire une plateforme durable.
                    </p>
                    <a
                        href="#signup"
                        className="mt-5 inline-flex items-center justify-center rounded-full border border-[#0f3d2e]/12 bg-white px-5 py-2.5 text-sm font-medium text-[#0f3d2e] transition-colors hover:bg-[#e6f5ef]"
                    >
                        Voir les postes
                    </a>
                </div>
            </div>
        </section>
    );
}
