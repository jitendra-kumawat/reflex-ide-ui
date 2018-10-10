import { CHANGE_PASSWORD_MENUITEM_ID, LOGOUT_MENUITEM_ID, HELP_MENUITEM_ID, ABOUT_MENUITEM_ID } from './constants';
//In header options set  modules as  Array of ModuleItem from @guavus/smart-components
export const applicationConfig = {
  options: {
    header: {
      options: {
        showSingleModule:false,
        modules: new Array(0),
        rightMenu: []
      }
    }
  }
};
