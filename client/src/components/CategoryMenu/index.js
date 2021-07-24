import React, {useEffect} from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_CATEGORIES } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';

import {useSelector, useDispatch} from 'react-redux';
import {UPDATE_CATEGORIES, UPDATE_CURRENT_CATEGORY} from '../../redux/features/categoriesSlice'

function CategoryMenu() {
 
  const dispatch = useDispatch();
  const {categories} = useSelector(state => state.categoryState);
  const {data: categoryData, loading} = useQuery(QUERY_CATEGORIES);

  useEffect(() => {
    if(categoryData) {
      dispatch(UPDATE_CATEGORIES({categories: categoryData.categories}));

      categoryData.categories.forEach(category => {
        idbPromise('categories', 'put', category);
      });
    }
    else if(!loading) {
      idbPromise('categories', 'get').then(categories => {
        dispatch(UPDATE_CATEGORIES({categories: categories}));
      })
    }
  }, [categoryData, loading, dispatch]);

  const clickHandler = id => {
    dispatch(UPDATE_CURRENT_CATEGORY({currentCategory: id}));
  }

  return (
    <div>
      <h2>Choose a Category:</h2>
      {categories.map((item) => (
        <button
          key={item._id}
          onClick={() => {
            clickHandler(item._id);
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryMenu;