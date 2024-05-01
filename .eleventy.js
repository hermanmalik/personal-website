// const htmlmin = require("html-minifier");

module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("private_html/_assets");
    eleventyConfig.addPassthroughCopy("private_html/_css");
    eleventyConfig.addPassthroughCopy("private_html/_img");
    eleventyConfig.addPassthroughCopy("private_html/_js");
    eleventyConfig.addPassthroughCopy("private_html/*.ico");
    eleventyConfig.addPassthroughCopy("private_html/*.txt");
    
    eleventyConfig.setPugOptions({ debug: true });

    // eleventyConfig.addTransform("htmlmin", function (content) {
	// 	if ((this.page.outputPath || "").endsWith(".html")) {
	// 		let minified = htmlmin.minify(content, {
	// 			useShortDoctype: true,
	// 			removeComments: true,
	// 			collapseWhitespace: true,
	// 		});

	// 		return minified;
	// 	}

	// 	// If not an HTML output, return content as-is
	// 	return content;
	// });
    
    return {
      dir: {
        input: "private_html",
        output: "public_html"
      }
    }
  };