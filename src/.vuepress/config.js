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
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['meta', { description: 'iota wasp shimmer assembly smart contract crypto tutorial'}]
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
          title: 'Hornet Shimmer',
          collapsable: true,
          children: [
            '/guide/shimmer/shimmer_requerimientos',
            '/guide/shimmer/shimmer_docker'
          ]
        },
        {
          title: 'Bee',
          collapsable: true,
          children: [
            '/guide/bee/bee_requerimientos',
            '/guide/bee/bee'
          ]
        },
        {
          title: 'GoShimmer',
          collapsable: true,
          children: [
            '/guide/goshimmer/goshimmer_requerimientos',
            '/guide/goshimmer/goshimmer'
          ]
        },
        {
          title: 'Certificado SSL',
          collapsable: true,
          children: [
            '/guide/certbot/certbot_requerimientos',
            '/guide/certbot/certbot_nginx',
            '/guide/certbot/certbot_ssl',
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
          title: 'Esp32',
          collapsable: true,
          children: [
            '/guide/esp32/esp32'
          ]
        },
        {
          title: 'Seguridad',
          collapsable: true,
          children: [
              {
                title: 'SSH seguro',
                collapsable: true,
                children: [
                  '/guide/seguridad/ssh/ssh_requerimientos',
                  '/guide/seguridad/ssh/ssh_openssh',
                  '/guide/seguridad/ssh/ssh_fail2ban',
                  '/guide/seguridad/ssh/ssh_google',
                  
                ]
              },
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
    '@vuepress/google-analytics',
    {
      'ga': 'G-4TS63YPR5N'
    }
  ]
}
