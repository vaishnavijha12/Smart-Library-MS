import NavbarSection from '@/components/home/NavbarSection'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
          <NavbarSection />
            {children}
        </div>
    )
}