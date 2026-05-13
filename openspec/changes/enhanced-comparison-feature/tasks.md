## 1. Selection UI Refinements

- [ ] 1.1 Implement the "Shortlist Bar" component in `SearchScreen.tsx` showing selected models.
- [ ] 1.2 Implement the "Nearing Limit" color logic (1 = blue, 2 = orange, 3 = amber).
- [ ] 1.3 Update the "Compare +" button on vehicle cards to show slot counts (e.g., "Add (1/3)").

## 2. Comparison Logic Enhancements

- [ ] 2.1 Update `ComparisonScreen.tsx` to explicitly label the first column as "Base Case".
- [ ] 2.2 Refactor difference logic to compare Vehicle 2 & 3 specifically against Vehicle 1.
- [ ] 2.3 Implement the "Show Differences Only" filter based on the Base Case comparison.

## 3. Tabular Categorization

- [ ] 3.1 Update the tabular view to clearly divide specs by Mechanical, Dimensions, Safety, Tech, and Interior.
- [ ] 3.2 Ensure category headers are sticky and distinct.

## 4. Polishing

- [ ] 4.1 Add a "Comparison Limit Reached" tooltip or snackbar.
- [ ] 4.2 Verify all logic works with the real scraped 2018 vehicle data.
