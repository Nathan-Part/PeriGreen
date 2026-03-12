export function Mission() {
    return (
        <section id="student-space" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid gap-8 rounded-[2rem] border border-[#2f8f6b]/10 bg-white/70 p-8 shadow-sm lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#2f8f6b]">Mission</p>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight">Permettre aux étudiants d&apos;accéder au matériel sans produire plus de déchets.</h2>
                </div>
                <div className="space-y-4 text-base leading-7 text-[#1b5e4b]">
                    <p>
                        PeriGreen aide l&apos;université à mettre à disposition des ordinateurs et autres équipements pour les
                        étudiants, en priorisant le matériel déjà existant.
                    </p>
                    <p>
                        La plateforme soutient une gestion plus responsable du parc : moins de gaspillage, plus de réemploi et
                        une baisse mesurable de l&apos;empreinte carbone liee aux achats et remplacements inutiles.
                    </p>
                </div>
            </div>
        </section>
    );
}
