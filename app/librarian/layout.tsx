import NavbarSection from '@/components/home/NavbarSection'

export default function({children}){
    return(
        <div>
          <NavbarSection/>
            {children}
        </div>
    )
}