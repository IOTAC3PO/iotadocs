const { description } = require('../../package')

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'Iota untangled',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: 'Desenredando Iota. Una guía simple y sencilla',

  /**description: description,*/

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: 'https://github.com/IOTAC3PO/iotadocs.git',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: true,
    nav: [
      {
        text: 'Guía',
        link: '/guide/',
      },

    ],
    sidebar: {
      '/guide/': [
        {
          title: 'Hornet',
          collapsable: true,
          children: [
            '/guide/hornet/hornet_requerimientos',
            '/guide/hornet/hornet_apt',
            '/guide/hornet/hornet_docker',
            '/guide/hornet/hornet_nativo'
          ]
        },

        {
          title: 'Bee',
          collapsable: true,
          children: [
            '/guide/bee/bee'
          ]
        },

        {
          title: 'GoShimmer',
          collapsable: true,
          children: [
            '/guide/goshimmer/goshimmer'
          ]
        },

        {
          title: 'Wasp',
          collapsable: true,
          children: [
            '/guide/wasp/wasp'
          ]
        },

        {
          title: 'Chronicle',
          collapsable: true,
          children: [
            '/guide/chronicle/chronicle'
          ]
        },


        {
          title: 'Esp32',
          collapsable: true,
          children: [
            '/guide/esp32/esp32'
          ]
        },

        {
          title: 'Traefik',
          collapsable: true,
          children: [
            '/guide/traefik/traefik'
          ]
        },

      ],

    }
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
    '@vuepress/plugin-google-analytics',
     {
       id: 'G-01CJP2RX6Q',
     },
  ]
}
