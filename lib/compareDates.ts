export const compareDates = (
	a: { updated: { at: Date } },
	b: { updated: { at: Date } },
	ascending: boolean = true
) => {
	const multiplier = ascending ? 1 : -1;
	return multiplier * (new Date(a.updated.at).getTime() - new Date(b.updated.at).getTime());
};
