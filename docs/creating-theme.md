# Use custom theme with custom theme-able Angular components  

Theme is often required when we build things that can be reused across different projects, or if the project we’re working on should simply enable the user to change the color scheme. The Angular Material project comes with some predefined themes. In this article we’ll explore how to create custom themes that will be used not only by components provided by Angular Material, but also our own custom ones.

## 1. Create a custom theme 

First We will create a custom theme according to angular material. 

1. The details about how to create a custom theme and available angular material mix-ins can be found [here](https://material.angular.io/guide/theming) 

1. How typography works in angular material can be found [here](https://material.angular.io/guide/typography)

1. All the available angular material theming functions and Material palette variables are included in `@angular/material/theming` file.

This is how our custom theme file (custom-theme.scss) will look like 

```scss 
@import '@angular/material/theming';

@include mat-core($gvs-default-font);

$gvs-theme-primary: mat-palette($mat-lime, 800, 600, 900);
$gvs-theme-accent: mat-palette($mat-light-blue, 500, 200, 900);
$gvs-theme-warn: mat-palette($mat-red, 500, 200, 900);

$custom-theme: mat-light-theme($gvs-theme-primary, $gvs-theme-accent, $gvs-theme-warn);

@mixin custom-theme($theme, $font-config) {
  // include your component's theme mix-in for font and color here
}

@include angular-material-theme($custom-theme);
@include custom-theme($custom-theme, $gvs-default-font);
```

After creating custom theme add our sass file to the list of styles in the .angular-cli.json configuration file and the Angular CLI will take care of compiling the css file.

```json
"styles": [
  "styles.css",
  "custom-theme.scss"
]
```

## 2. How to create theme-able components

  1. When we create a angular component (screen/page/widget etc), we add a base style (less/css/scss) file that introduces just enough styles so that the component is usable and accessible. No colors and fonts applied though.

  For example We created a test component with it's html file looks like this 

  ```html 
  <div class="gvs-test-box">
    <label class="gvs-test-label">
       This is a Custom Component
    </label>
  </div>
  ```

  Here is how its style file (less/css/scss) will look like

 ```css 
 .gvs-test-box {
  display: flex;
  flex-direction: column;
  max-width: 700px;
  padding: 10px;
}
 
 
.gvs-test-label {
  font-size: 20px;
  font-style: italic;
  font-weight: bold;
  margin-bottom: 5px;
}
```

2. Then we should create a SASS partial file (*.scss) to keep all the theme related styles. (We are using sass files because we have to use some mix-ins from material design and material components uses SASS). Here we used some of angular material's built in mix-ins (map-get, mat-color). 

Details about SASS including how partial file works can be found [here](https://sass-lang.com/guide) 


 ```scss
 @mixin gvs-test-component-theme ($theme, $font-config) {
 
  $primary: map-get($theme, primary);
  $warn: map-get($theme, warn);
  $background: map-get($theme, background);
  $foreground: map-get($theme, foreground);
 
  .gvs-test-box {
    border: 1px solid mat-color($foreground, divider);
    background-color: mat-color($background, background);
  }
 
  .gvs-test-label {
    color: mat-color($foreground, text);
    font-size: mat-font-size($font-config, title);
  }
}
```

## 3. Use theme-able component with custom theme

After creating our theme-able component we will use it in our solution. 
We call these component's theme mix-in from our custom theme (SCSS file).

```scss
@mixin custom-theme($theme, $font-config) {
  // include your component's theme mix-in for font and color here
  @include gvs-test-component-theme($theme, $font-config);
}
```
