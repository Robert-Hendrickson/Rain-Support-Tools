export const homeNavTemplate = `<div class="menu_links">
    <div id="menu_tabs">
        <div v-for="nav_item in nav_list" :class="nav_item.title === 'Ticket Tools' ? 'active' : ''" @click="updateNavButtons($event.target)" :id="nav_item.title.replace(' ', '-')">{{nav_item.title}}</div>
    </div>
    <div class="toolButtonsList">
        <div v-for="nav_item in nav_list" :class="nav_item.title === 'Ticket Tools' ? 'active' : ''" :id="nav_item.title.replace(' ', '-')">
            <div v-for="nav_link_item in nav_item.link_data" class="toolButton">
                <a v-bind:href="nav_link_item.url" v-bind:target="nav_link_item.target">
                    <button>
                    <span v-bind:class="nav_link_item.icon + ' fa-3x'"></span><div>{{nav_link_item.name}} {{nav_link_item.subTitle}}</div></button>
                </a>
            </div>
        </div>
    </div>
</div>`;