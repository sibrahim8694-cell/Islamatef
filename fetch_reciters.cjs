async function getReciters() {
    try {
        const res = await fetch('https://mp3quran.net/api/v3/reciters');
        const json = await res.json();
        console.log(json.reciters.map(r => r.name + " (" + r.id + ") - " + r.Server).join('\n'));
    } catch (e) {
        console.error(e);
    }
}
getReciters();
