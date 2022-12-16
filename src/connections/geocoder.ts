export async function geocode(addr: string): Promise<{ matched: string, lat: number, lon: number, city: string } | undefined> {
	if (addr.length > 0) {
		const key = "94209aca95f886c6a96895993228858c49a433e";
		const url = `https://api.geocod.io/v1.7/geocode?q=${encodeURIComponent(addr)}&api_key=${key}`
		const res = await fetch(url);
		const json = await res.json();
		const first = json.results[0];
		if (first !== undefined) {
			return {
				lat: first.location.lat,
				lon: first.location.lng,
				matched: first.formatted_address,
				city: first.address_components.city
			}
		} else {
			return undefined;
		}
	} else {
		return undefined;
	}

}