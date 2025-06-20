export const toolNavTemplate = `<div id="nav-toggle" @click="this.showNav = !this.showNav">
    <span class="fa-solid fa-bars"></span>
</div>
<div class="secondary_menu_links" :class="this.showNav ? 'active' : ''">
    <div class="toolButtonsList">
        <div>
            <div class="nav-header">General</div>
            <ul>
                <li class="toolButton">
                    <a href="/Rain-Support-Tools/">
                        <div>
                            <span class="fa-solid fa-house"></span>Home
                        </div>
                    </a>
                </li>
                <li class="toolButton">
                    <a href="https://github.com/Robert-Hendrickson/Rain-Support-Tools/pulls?q=is%3Amerged" target="blank">
                        <div>
                            <span class="fa-solid fa-wrench"></span>System Updates
                        </div>
                    </a>
                </li>
            </ul>
        </div>
        <div v-for="nav_item in nav_list">
            <div class="nav-header">{{nav_item.title}}</div>
            <ul>
                <li v-for="nav_link_item in nav_item.link_data" class="toolButton">
                    <a v-bind:href="nav_link_item.url" v-bind:target="nav_link_item.target">
                        <div>
                            <span v-bind:class="nav_link_item.icon"></span>{{nav_link_item.name}}<span class="sub-title">{{nav_link_item.subTitle}}</span>
                        </div>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</div>`;