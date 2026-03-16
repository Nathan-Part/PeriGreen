import { motion } from 'framer-motion';

const journeySteps = [
    {
        step: 'Inscription',
        title: 'Créer votre compte étudiant',
        description: "Inscrivez-vous avec votre profil universitaire pour accéder à la plateforme.",
    },
    {
        step: 'Sélection',
        title: 'Chercher ou offrir du matériel',
        description: 'Parcourez les annonces de matériel disponible au réemploi.',
    },
    {
        step: 'Échange',
        title: 'Finaliser votre emprunt',
        description: "Organisez le retrait ou le retour selon les modalités définies par l'université.",
    },
];

export function Processus() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="rounded-[2rem] border border-[#2f8f6b]/10 bg-white/78 p-8 shadow-sm lg:p-10">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#2f8f6b]">Processus</p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0f3d2e]">Trois étapes simples</h2>
                    <p className="mt-3 text-sm leading-7 text-[#1b5e4b]">
                        Emprunter du matériel réemployé se fait en quelques étapes claires.
                    </p>
                </div>
                <div className="mt-8 grid gap-4 lg:grid-cols-3">
                    {journeySteps.map((step, index) => (
                        <motion.div
                            key={step.step}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.14 + index * 0.08, duration: 0.45 }}
                            className="flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-[#2f8f6b]/12 bg-[#f9fdfb]"
                        >
                            <div className="border-b border-[#2f8f6b]/10 px-5 py-4">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2f8f6b]">{step.step}</p>
                                <h3 className="mt-2 text-xl font-bold leading-7 text-[#0f3d2e]">{step.title}</h3>
                                <p className="mt-3 text-sm leading-6 text-[#1b5e4b]">{step.description}</p>
                            </div>
                            <div className="flex min-h-28 flex-1 items-end bg-[#eaf4ee] p-4">
                                <div className="flex h-14 w-full items-center justify-center rounded-xl border border-dashed border-[#2f8f6b]/18 bg-[#dfeae3] text-[#7d9388]">
                                    image
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
