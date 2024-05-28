'use client';
import React from 'react';
import Autoplay from 'embla-carousel-autoplay';

import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { HomePageImage } from '@/types/extended';

interface Props {
	className?: string;
	images: HomePageImage[];
}

export const ImagesCarusel = ({ className, images }: Props) => {
	const plugin = React.useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

	return (
		<Carousel
			plugins={[plugin.current]}
			className={cn(`w-full h-full `, className)}
			onMouseEnter={plugin.current.stop}
			onMouseLeave={plugin.current.reset}>
			<CarouselContent className='h-full w-full'>
				{images.map((img, index) => (
					<CarouselItem key={index}>
						<div className='w-full overflow-hidden  rounded-3xl border border-border h-fit '>
							<AspectRatio ratio={16 / 9}>
								<Image
									className='w-full h-full object-cover'
									src={img.src}
									alt={img.alt}
									width={1900}
									height={1900}
								/>
							</AspectRatio>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
		</Carousel>
	);
};
