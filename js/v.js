var app;

function loadVue() {
	app = new Vue({
	    el: "#app",
	    data: {
            player,
            notate,
            FUNCTIONS,
            UPGRADES,
            TABS,
        }
	})
}