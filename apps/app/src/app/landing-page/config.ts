import {
  ABOUT_MENUITEM_ID,
  CHANGE_PASSWORD_MENUITEM_ID,
  HELP_MENUITEM_ID,
  LOGOUT_MENUITEM_ID
  } from './constants';
//In header options set  modules as  Array of ModuleItem from @guavus/smart-components
export const applicationConfig = {
  options: {
    header: {
      options: {
        showSingleModule:false,
        modules: new Array(0),
        rightMenu: [
          {
            label: 'admin',
            labelStyle: 'none',
            imgStyle: 'img-circle',
            img: 'assets/images/profile.png',
            groupStyle: 'dropDown',
            minWidth: '160px',
            menu: [
            ]
          },
          {
            img: 'assets/images/help_Up.svg',
            minWidth: '71px',
            menu: [
              {
                id: HELP_MENUITEM_ID,
                label: 'Help',
                data: 'HELP',
                url: '/help'
              },
              {
                id: ABOUT_MENUITEM_ID,
                label: 'About',
                data: 'SHOW_ABOUT'
              }
            ]
          }
        ]
      }
    }
  }
};
