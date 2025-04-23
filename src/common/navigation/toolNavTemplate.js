export const toolNavTemplate = `<div class="secondary_menu_links">
    <div class="toolButtonsList">
        <ul>
            <li v-for="nav_item in nav_list.home" class="toolButton">
                <a v-bind:href="nav_item.url" v-bind:target="nav_item.target">
                    <div>
                        <span v-bind:class="nav_item.icon"></span>{{nav_item.name}}<span class="sub-title">{{nav_item.subTitle}}</span>
                    </div>
                </a>
            </li>
        </ul>
        <div class="nav-header">Support Tools</div>
        <ul>
            <li v-for="nav_item in nav_list.support" class="toolButton">
                <a v-bind:href="nav_item.url" v-bind:target="nav_item.target">
                    <div>
                        <span v-bind:class="nav_item.icon"></span>{{nav_item.name}}<span class="sub-title">{{nav_item.subTitle}}</span>
                    </div>
                </a>
            </li>
        </ul>
        <div class="nav-header">System Tools</div>
        <ul>
            <li v-for="nav_item in nav_list.system" class="toolButton">
                <a v-bind:href="nav_item.url" v-bind:target="nav_item.target">
                    <div>
                        <span v-bind:class="nav_item.icon"></span>{{nav_item.name}}<span class="sub-title">{{nav_item.subTitle}}</span>
                    </div>
                </a>
            </li>
        </ul>
        <div class="nav-header">Misc Tools</div>
        <ul>
            <li v-for="nav_item in nav_list.misc" class="toolButton">
                <a v-bind:href="nav_item.url" v-bind:target="nav_item.target">
                    <div>
                        <span v-bind:class="nav_item.icon"></span>{{nav_item.name}}<span class="sub-title">{{nav_item.subTitle}}</span>
                    </div>
                </a>
            </li>
        </ul>
    </div>
</div>`;