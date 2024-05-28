export const defaultMindMap = {
	emoji: '1f49a',
	title: 'My first mind map',
	content: {
		edges: [
			{
				id: 'reactflow__edge-db479655-f0af-4ccd-8a39-b97358fcd0be-f990c122-87da-42f7-a8e8-7a39c2343b3a',
				source: 'db479655-f0af-4ccd-8a39-b97358fcd0be',
				target: 'f990c122-87da-42f7-a8e8-7a39c2343b3a',
				sourceHandle: null,
				targetHandle: null,
			},
			{
				id: 'reactflow__edge-f990c122-87da-42f7-a8e8-7a39c2343b3a-56439e5b-714d-4bad-9104-f15f5f5f7e06',
				data: { color: 'YELLOW', label: 'Click me!' },
				type: 'customStepSharp',
				source: 'f990c122-87da-42f7-a8e8-7a39c2343b3a',
				target: '56439e5b-714d-4bad-9104-f15f5f5f7e06',
				animated: true,
				selected: false,
				sourceHandle: null,
				targetHandle: null,
			},
			{
				id: 'reactflow__edge-f990c122-87da-42f7-a8e8-7a39c2343b3a-53b28890-aea3-4929-8283-b8dd481fd590',
				data: { color: 'PURPLE', label: 'edit me!' },
				type: 'customStraight',
				source: 'f990c122-87da-42f7-a8e8-7a39c2343b3a',
				target: '53b28890-aea3-4929-8283-b8dd481fd590',
				animated: false,
				selected: false,
				sourceHandle: null,
				targetHandle: null,
			},
		],
		nodes: [
			{
				id: 'db479655-f0af-4ccd-8a39-b97358fcd0be',
				data: { text: 'Create new tile!', color: 5 },
				type: 'textNode',
				width: 197,
				height: 52,
				dragging: false,
				position: { x: -644.4364521868802, y: 135.3865041676723 },
				selected: false,
				positionAbsolute: { x: -644.4364521868802, y: 135.3865041676723 },
			},
			{
				id: '53b28890-aea3-4929-8283-b8dd481fd590',
				data: { text: 'change my position!', color: 11 },
				type: 'textNode',
				width: 235,
				height: 52,
				dragging: false,
				position: { x: 87.97937925554032, y: -272.1379184809945 },
				selected: true,
				positionAbsolute: { x: 87.97937925554032, y: -272.1379184809945 },
			},
			{
				id: '56439e5b-714d-4bad-9104-f15f5f5f7e06',
				data: { text: 'build your dream mind map', color: 8 },
				type: 'textNode',
				width: 295,
				height: 52,
				dragging: false,
				position: { x: 123.4120241836796, y: 139.1527561721755 },
				selected: false,
				positionAbsolute: { x: 123.4120241836796, y: 139.1527561721755 },
			},
			{
				id: 'f990c122-87da-42f7-a8e8-7a39c2343b3a',
				data: { text: 'change color!', color: 9 },
				type: 'textNode',
				width: 179,
				height: 52,
				dragging: false,
				position: { x: -339.8150393962544, y: -106.9808466868295 },
				selected: false,
				positionAbsolute: { x: -339.8150393962544, y: -106.9808466868295 },
			},
		],
		viewport: { x: 727.667045591992, y: 340.6718941497318, zoom: 1.073889064960088 },
	},
};

export const defaultTask = {
	title: 'Welcome to StudyFlow',
	emoji: '1f44b',
	content: {
		type: 'doc',
		content: [
			{
				type: 'heading',
				attrs: { level: 2 },
				content: [
					{ text: 'Click on a free space or press Enter to open the tool panel', type: 'text' },
				],
			},
			{
				type: 'heading',
				attrs: { level: 4 },
				content: [
					{
						text: 'Choose me and change my ',
						type: 'text',
						marks: [{ type: 'textStyle', attrs: { color: '#f43f5e' } }],
					},
					{
						text: 'color',
						type: 'text',
						marks: [{ type: 'textStyle', attrs: { color: '#8b5cf6' } }],
					},
				],
			},
			{
				type: 'bulletList',
				content: [
					{
						type: 'listItem',
						content: [
							{ type: 'paragraph', content: [{ text: 'Make some fancy list', type: 'text' }] },
						],
					},
					{
						type: 'listItem',
						content: [
							{
								type: 'paragraph',
								content: [
									{
										text: 'you can underline',
										type: 'text',
										marks: [
											{ type: 'underline' },
											{ type: 'textStyle', attrs: { color: '#10b981' } },
										],
									},
								],
							},
						],
					},
					{
						type: 'listItem',
						content: [
							{
								type: 'paragraph',
								content: [
									{
										text: 'strikethrought',
										type: 'text',
										marks: [{ type: 'strike' }, { type: 'textStyle', attrs: { color: '#f59e0b' } }],
									},
								],
							},
						],
					},
					{
						type: 'listItem',
						content: [
							{
								type: 'paragraph',
								content: [
									{
										text: 'make italics',
										type: 'text',
										marks: [
											{ type: 'italic' },
											{ type: 'strike' },
											{ type: 'textStyle', attrs: { color: 'rgb(56, 189, 248)' } },
										],
									},
								],
							},
						],
					},
					{
						type: 'listItem',
						content: [
							{
								type: 'paragraph',
								content: [{ text: 'or just bold', type: 'text', marks: [{ type: 'bold' }] }],
							},
						],
					},
					{
						type: 'listItem',
						content: [
							{
								type: 'paragraph',
								content: [
									{
										text: 'or maybe use all of these',
										type: 'text',
										marks: [
											{ type: 'bold' },
											{ type: 'italic' },
											{ type: 'strike' },
											{ type: 'underline' },
											{ type: 'textStyle', attrs: { color: 'rgb(139, 92, 246)' } },
										],
									},
								],
							},
						],
					},
				],
			},
			{ type: 'paragraph' },
			{
				type: 'heading',
				attrs: { level: 1 },
				content: [
					{
						text: 'Add some nice links',
						type: 'text',
						marks: [
							{
								type: 'link',
								attrs: {
									rel: 'noopener noreferrer nofollow',
									href: 'https://github.com/sepetowski/studyFlow',
									class: null,
									target: '_blank',
								},
							},
						],
					},
				],
			},
			{
				type: 'heading',
				attrs: { level: 6 },
				content: [
					{
						text: 'And images from your device or via link',
						type: 'text',
						marks: [{ type: 'bold' }],
					},
				],
			},
			{
				type: 'image',
				attrs: {
					alt: null,
					src: 'https://cdn.pixabay.com/photo/2024/01/12/15/43/male-8504261_1280.jpg',
					title: null,
				},
			},
			{
				type: 'heading',
				attrs: { level: 3 },
				content: [
					{
						text: 'Just have ',
						type: 'text',
						marks: [{ type: 'textStyle', attrs: { color: '#8b5cf6' } }],
					},
					{
						text: 'FUN',
						type: 'text',
						marks: [{ type: 'bold' }, { type: 'textStyle', attrs: { color: '#8b5cf6' } }],
					},
				],
			},
		],
	},
};
