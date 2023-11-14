module.exports = {
  plugins: [
    require('autoprefixer')({ grid: "no-autoplace" }),
    require('postcss-gap-properties'),
    require('postcss-focus'),
    require('postcss-object-fit-images'),
    require('cssnano')({
        preset: 'default',
    }),
    require('postcss-import-url')({
      modernBrowser: true
    }),
  ]
}