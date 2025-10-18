import NavbarSection from '@/components/home/NavbarSection'

export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="pt-20">
            <NavbarSection />
            {children}
        </div>
    )
}