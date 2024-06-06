"use client"

import React from 'react';
import { Nav } from './nav/Nav';
import { Header } from './header/Header';
import { Section } from './section/Section';
import { TextSection } from './section/TextSection';
import {
	homePageAssigmentFilterAndStarredImgs,
	homePageCalendarImgs,
	homePageChatImgs,
	homePageMindMapsImgs,
	homePagePomodoroImgs,
	homePageRolesAndSettingsImgs,
	homePageTasksImgs,
} from '@/lib/constants';
import { Footer } from './footer/Footer';


import { useEffect } from "react";
import { PiStarFourFill } from "react-icons/pi";
import SplitAbout from './about/About';
import Hero from './hero/Hero';
import { AnimatedTooltipPreview } from './hero/Tooltibedemo';
import HorizontalScroller1 from './footer/BrandAnimation';

export const HomePage = () => {


	return (
		<>
			<Nav />
			<div className='w-full mx-auto max-w-screen-xl px-4 sm:px-6  '>

				<div>
					<Hero />
				</div>


				<Header />

				<main>
					<TextSection title='BEST_FRIEND.TITLE' desc='BEST_FRIEND.DESC' />

					<Section
						id='Mind-Maps'
						title='MIND_MAPS.TITLE'
						desc='MIND_MAPS.DESC'
						images={homePageMindMapsImgs}
						reverse
					/>
					<Section id='Tasks' title='TASKS.TITLE' desc='TASKS.DESC' images={homePageTasksImgs} />
					<Section
						id='Roles'
						title='ROLES.TITLE'
						desc='ROLES.DESC'
						images={homePageRolesAndSettingsImgs}
					/>
					<Section
						id='Pomodoro'
						title='POMODORO.TITLE'
						desc='POMODORO.DESC'
						images={homePagePomodoroImgs}
						reverse
					/>

					<TextSection title='NEXT_GENERATION.TITLE' desc='NEXT_GENERATION.DESC' />

					<div className='mt-4 p-4 flex justify-center items-center'>
						<AnimatedTooltipPreview />
					</div>
					<Section id='Chat' title='CHAT.TITLE' desc='CHAT.DESC' images={homePageChatImgs} />
					<Section
						id='Calendar'
						title='CALENDAR.TITLE'
						desc='CALENDAR.DESC'
						images={homePageCalendarImgs}
						reverse
					/>
					<Section
						id='Easy-To-Find'
						title='EASY_TO_FIND.TITLE'
						desc='EASY_TO_FIND.DESC'
						images={homePageAssigmentFilterAndStarredImgs}
					/>
				</main>
			</div>
			<div className='p-2 mt-2'>
				<HorizontalScroller1 />
			</div>

			<SplitAbout />
			<Footer />
		</>
	);
};
