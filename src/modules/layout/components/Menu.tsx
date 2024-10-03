import Link from 'next/link'

import HomeIcon from '@mui/icons-material/Home';
import TodayIcon from '@mui/icons-material/Today';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { usePathname } from 'next/navigation'

export default function Menu() {

	const router = usePathname();

	const options = [
		{
			id: 1,
			name: "Home",
			icon: <HomeIcon />,
			link: "/"
		},
		{
			id: 2,
			name: "Pacientes",
			icon: <AccountCircleIcon />,
			link: "/pacients"
		},
		{
			id: 3,
			name: "Citas",
			icon: <TodayIcon />,
			link: "/dates"
		},
		{
			id: 4,
			name: "Mi cuenta",
			icon: <AssessmentIcon />,
			link: "/myaccount"
		},
	]

	return (
		<div className='fixed bottom-0 z-50 w-[28rem] p-4 h-16 bg-primary-color flex justify-around items-center'>
			{options.map(option => {
				return (
					<Link key={option.id} href={option.link}>
						<div className={`flex flex-col items-center text-white ${option.link === router && "text-primary-pressed"}`}>
							<span className={`text-white ${option.link === router && "text-primary-pressed"}`}>{option.icon}</span>
							<span className='text-xs font-extralight tracking-widest mt-1'>{option.name}</span>
						</div>
					</Link>
				)
			})}
		</div>
	)
}
