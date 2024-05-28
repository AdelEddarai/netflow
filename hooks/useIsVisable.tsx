import { useIntersection } from '@mantine/hooks';
import { useEffect, useRef, useState } from 'react';

export const useIsVisable = () => {
	const item = useRef<null | HTMLElement>(null);

	const [isVisable, setIsVisable] = useState(false);

	const { entry, ref } = useIntersection({
		root: item.current,
		threshold: 1,
	});

	useEffect(() => {
		if (entry?.isIntersecting) {
			setIsVisable(true);
		} else {
			setIsVisable(false);
		}
	}, [entry]);

	return {
		isVisable,
		ref,
	};
};
