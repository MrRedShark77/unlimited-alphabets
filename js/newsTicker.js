var news = [
    'abcdefghijklmnopqrstuvwxyz...',
    'Subscribe SuperSpruce!',
    'Alex is Alexis. -MrRedShark77',
    'BEEE... -Unverifyed',
    "Guys! The n-word has been revealed! It's ninth dimension! -SuperSpruce",
];

rand = function(min, max) {
    if (min==null && max==null) return 0;    
    if (max == null) {
        max = min;
        min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
};

function newsTicker(){
    document.getElementById('news_ticker').textContent = news[rand(0, news.length-1)];
}

setInterval(newsTicker, 6000);