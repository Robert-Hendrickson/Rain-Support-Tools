export const toolNavTemplate = `<div id="nav-toggle" @click="toggleNav">
    <span class="fa-solid fa-bars"></span>
</div>
<div class="secondary_menu_links">
    <div class="toolButtonsList">
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