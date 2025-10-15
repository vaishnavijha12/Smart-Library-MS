import NavbarSection from '@/components/home/NavbarSection'

export default function LibrarianLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
          <NavbarSection />
            {children}
        </div>
    )
}