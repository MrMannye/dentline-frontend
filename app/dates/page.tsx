'use client'

import CardDate from "@/src/modules/date/CardDate"

export default function page() {
	return (
		<div className="flex-1 w-full px-8 py-4 space-y-4">
			{[1, 2, 3, 4].map(date => {
				return (
					<CardDate key={date}></CardDate>
				)
			})}
		</div>
	)
}
