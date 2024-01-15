import * as model from './model.js';
import recipeView from './views/recipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationViews from './views/paginationViews.js';
import bookmarkViews from './views/bookmarkViews.js';
import addRecipeView from './views/addRecipeView.js';
import { Model_Close_Timer } from './config.js';
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    // Loading Recipe
    resultsView.update(model.getSearchResultsPage());
    bookmarkViews.update(model.state.bookmarks);
    await model.loadRecipe(id);
    // Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;
    await model.loadSearchResults(query);
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());
    paginationViews.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const ControlPagination = function (gotoPage) {
  resultsView.render(model.getSearchResultsPage(gotoPage));
  paginationViews.render(model.state.search);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
};

// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);

const controlAddBookmark = function () {
  // Add/Remove recipe bookmarks
  if (!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  //Update Changes
  recipeView.update(model.state.recipe);

  // Render Bookmarks
  bookmarkViews.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    await model.uploadRecipe(newRecipe);

    addRecipeView.renderSpinner();

    recipeView.render(model.state.recipe);

    bookmarkViews.render(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    addRecipeView.renderMessage();

    setTimeout(() => {
      addRecipeView._addHandlerCloseWindow();
    }, Model_Close_Timer);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const controlBookmarks = () => bookmarkViews.render(model.state.bookmarks);
const init = function () {
  bookmarkViews.addHandlerRenderer(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationViews.addHandletClick(ControlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
