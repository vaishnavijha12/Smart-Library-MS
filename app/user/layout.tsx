import NavbarSection from '@/components/home/NavbarSection'
export default function UserLayout({children}){
    return(
        <div>
            <NavbarSection/>
            {children}
        </div>
    )
}