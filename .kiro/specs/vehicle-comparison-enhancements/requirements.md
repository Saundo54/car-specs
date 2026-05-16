# Requirements Document

## Introduction

This document specifies requirements for enhancing a React-based vehicle comparison application with eight new features designed to improve user experience, data comprehension, and decision-making capabilities. The enhancements focus on intelligent data filtering, contextual explanations, practical visualizations, and automated insights to help users make informed vehicle purchase decisions.

## Glossary

- **Comparison_Screen**: The primary interface displaying side-by-side vehicle specifications organized in tabbed categories (mechanical, dimensions, safety, tech, interior)
- **Diff_Toggle**: A user interface control that filters the comparison view to show only specifications that differ between vehicles
- **Accordion_View**: A collapsible user interface component that can expand or collapse to show or hide content
- **Spec_Row**: A single row in the comparison grid displaying one specification attribute across all compared vehicles
- **Base_Vehicle**: The first vehicle in the comparison list, used as the reference point for highlighting differences
- **Best_In_Class_Metric**: A specification value that represents the superior performance among compared vehicles for a given attribute
- **Boot_Capacity**: The cargo storage volume measured in litres, typically found in the dimensions category
- **Technical_Term**: Industry-specific jargon or terminology used in vehicle specifications (e.g., "Torque converter", "ADAS", "Regenerative braking")
- **Tooltip**: A small contextual popup that appears when a user hovers over or taps an element
- **Lifestyle_Quiz**: A short questionnaire that captures user preferences and usage patterns to recommend suitable vehicle categories
- **Feature_Filter**: A user interface control that allows filtering vehicles based on the presence of specific convenience features
- **ANCAP_Rating**: The Australasian New Car Assessment Program safety rating, displayed as a star rating (1-5 stars)
- **ANCAP_Test_Year**: The calendar year when the ANCAP safety test was conducted for a specific vehicle
- **AI_Summary**: An automatically generated text summary that highlights key trade-offs and differences between compared vehicles
- **BabyDrive_Database**: An external reference database at https://babydrive.com.au/ containing real-world cargo capacity measurements
- **Luggage_Icon**: A visual representation showing practical cargo capacity using relatable objects (suitcases, prams, grocery bags)
- **Heuristic_Model**: A rule-based calculation that infers practical cargo capacity from boot volume measurements
- **Info_Button**: A user interface element that displays additional contextual information when activated
- **PWA_Manifest**: The Progressive Web App configuration file (manifest.webmanifest) that defines app metadata and icons for installable web applications
- **Mobile_App_Icon**: A PNG image file specifically designed for mobile device home screens when the PWA is installed
- **Icon_Configuration**: The icons array in the PWA_Manifest that specifies image sources, sizes, types, and purposes for different contexts

## Requirements

### Requirement 1: Smart Diff-Only Accordion View

**User Story:** As a user comparing multiple vehicles, I want to collapse identical specifications into minimal summaries, so that I can focus only on the meaningful differences between vehicles.

#### Acceptance Criteria

1. THE Comparison_Screen SHALL provide a Diff_Toggle control that persists in a fixed position during scrolling
2. WHEN the Diff_Toggle is activated, THE Comparison_Screen SHALL collapse all Spec_Rows where values are identical across all compared vehicles
3. WHEN a Spec_Row is collapsed, THE Comparison_Screen SHALL display a summary indicator showing the count of hidden identical specifications
4. WHEN the Diff_Toggle is deactivated, THE Comparison_Screen SHALL expand all Spec_Rows to show both identical and different specifications
5. THE Accordion_View SHALL maintain the current tab context when toggling between collapsed and expanded states
6. WHEN transitioning between collapsed and expanded states, THE Comparison_Screen SHALL animate the transition within 300ms

### Requirement 2: Best-in-Class Spec Highlight and Weighting

**User Story:** As a user evaluating vehicle performance, I want to instantly identify which vehicle has the best value for each specification, so that I can quickly determine the statistical winner.

#### Acceptance Criteria

1. FOR ALL numeric specifications in the mechanical category, THE Comparison_Screen SHALL identify the Best_In_Class_Metric
2. WHEN Power, Torque, or Engine_Size represents the Best_In_Class_Metric, THE Comparison_Screen SHALL apply a visual badge to that value
3. WHEN Fuel_Consumption represents the Best_In_Class_Metric, THE Comparison_Screen SHALL identify the lowest value as best and apply a visual badge
4. THE Comparison_Screen SHALL use distinct color coding for Best_In_Class_Metric values that differs from the existing better/worse/different color scheme
5. WHERE a specification has equal values across multiple vehicles, THE Comparison_Screen SHALL apply the Best_In_Class_Metric badge to all tied values
6. THE Comparison_Screen SHALL display a badge icon alongside Best_In_Class_Metric values that is visible without scrolling the value cell

### Requirement 3: Boot and Cabin Visualizer

**User Story:** As a parent or shopper, I want to see cargo capacity represented with familiar objects like suitcases and prams, so that I can immediately understand if my belongings will fit.

#### Acceptance Criteria

1. WHEN Boot_Capacity is displayed in the dimensions category, THE Comparison_Screen SHALL show Luggage_Icon representations alongside the litre value
2. THE Comparison_Screen SHALL calculate luggage equivalents using a Heuristic_Model derived from the BabyDrive_Database
3. THE Heuristic_Model SHALL map boot litre ranges to specific luggage combinations (large suitcases, prams, grocery bags)
4. THE Comparison_Screen SHALL provide an Info_Button adjacent to the Boot_Capacity visualization
5. WHEN the Info_Button is activated, THE Comparison_Screen SHALL display a modal explaining the Heuristic_Model methodology and BabyDrive_Database cross-reference
6. THE Luggage_Icon representation SHALL update dynamically when different vehicles are added or removed from comparison
7. WHERE Boot_Capacity data is unavailable for a vehicle, THE Comparison_Screen SHALL display only the dash placeholder without Luggage_Icon representations

### Requirement 4: Plain English Spec Translator

**User Story:** As a non-technical user, I want to see simple explanations of confusing automotive terms, so that I understand how each feature benefits my daily driving.

#### Acceptance Criteria

1. THE Comparison_Screen SHALL identify Technical_Terms in all specification categories
2. WHEN a user hovers over a Technical_Term on desktop, THE Comparison_Screen SHALL display a Tooltip within 200ms
3. WHEN a user taps a Technical_Term on mobile, THE Comparison_Screen SHALL display a Tooltip that remains visible until dismissed
4. THE Tooltip SHALL contain a single-sentence explanation of the Technical_Term written in plain English
5. THE Tooltip SHALL describe the practical benefit or impact of the Technical_Term on daily driving
6. THE Comparison_Screen SHALL maintain a glossary of Technical_Terms with their plain English explanations
7. WHERE a Technical_Term has no defined explanation, THE Comparison_Screen SHALL not display a Tooltip for that term

### Requirement 5: Everyday Lifestyle Match Quiz

**User Story:** As an undecided buyer, I want to answer a few simple questions about my lifestyle, so that the app can recommend vehicle categories that match my needs.

#### Acceptance Criteria

1. THE Application SHALL provide a Lifestyle_Quiz accessible from the search screen
2. THE Lifestyle_Quiz SHALL present exactly three questions to the user
3. THE Lifestyle_Quiz SHALL ask about parking environment, passenger requirements, and commute distance
4. WHEN the Lifestyle_Quiz is completed, THE Application SHALL filter the vehicle database to show only matching categories
5. THE Lifestyle_Quiz SHALL provide an Info_Button that explains the filtering logic
6. WHEN the Info_Button is activated, THE Application SHALL display a modal describing how quiz responses map to vehicle recommendations
7. THE Application SHALL allow users to reset or retake the Lifestyle_Quiz at any time
8. THE Application SHALL persist Lifestyle_Quiz results across user sessions

### Requirement 6: Must-Have Feature Checklist Filters

**User Story:** As a user with specific feature requirements, I want to filter vehicles by modern convenience features, so that I only see cars that include my essential amenities.

#### Acceptance Criteria

1. THE Application SHALL provide Feature_Filter controls on the search screen
2. THE Feature_Filter SHALL include options for Apple_CarPlay, Android_Auto, Heated_Seats, and 360_Camera
3. WHEN a Feature_Filter is selected, THE Application SHALL display only vehicles that include the specified feature in their tech or interior specifications
4. THE Application SHALL support multiple simultaneous Feature_Filter selections using AND logic
5. THE Application SHALL display a count of matching vehicles as Feature_Filter selections change
6. WHEN no vehicles match the selected Feature_Filter combination, THE Application SHALL display a message suggesting filter adjustment
7. THE Application SHALL allow users to clear all Feature_Filter selections with a single action

### Requirement 7: ANCAP Safety Rating and Date Context Breakdown

**User Story:** As a safety-conscious buyer, I want to see both the ANCAP star rating and the year it was tested, so that I can assess whether the rating meets current safety standards.

#### Acceptance Criteria

1. WHEN ANCAP_Rating is displayed in the safety category, THE Comparison_Screen SHALL also display the ANCAP_Test_Year adjacent to the rating
2. THE Comparison_Screen SHALL visually emphasize ANCAP_Rating values that are older than five years from the current year
3. THE Comparison_Screen SHALL display a warning indicator for vehicles where ANCAP_Test_Year is more than seven years old
4. THE Comparison_Screen SHALL provide a Tooltip explaining that older ANCAP_Rating values may not reflect current safety standards
5. WHERE ANCAP_Rating exists but ANCAP_Test_Year is unavailable, THE Comparison_Screen SHALL display the rating with a data-unavailable indicator
6. THE Comparison_Screen SHALL sort vehicles by ANCAP_Rating when the safety tab is active, with ties broken by ANCAP_Test_Year (newer first)

### Requirement 8: Automated AI Summary

**User Story:** As a user comparing vehicles, I want to see an instant summary of key trade-offs, so that I can quickly understand the practical differences without analyzing every specification.

#### Acceptance Criteria

1. THE Comparison_Screen SHALL generate an AI_Summary when two or more vehicles are being compared
2. THE AI_Summary SHALL appear at the top of the Comparison_Screen above the tabbed specification grid
3. THE AI_Summary SHALL identify and describe explicit trade-offs between compared vehicles using objective data points
4. THE AI_Summary SHALL reference specific specification categories (mechanical, dimensions, safety) in the trade-off descriptions
5. THE AI_Summary SHALL use plain English without technical jargon in the summary text
6. THE AI_Summary SHALL update automatically when vehicles are added to or removed from the comparison
7. THE AI_Summary SHALL limit the summary to a maximum of three key trade-offs to maintain conciseness
8. WHERE vehicles are very similar, THE AI_Summary SHALL state that differences are minimal and highlight the few distinguishing factors
9. THE Comparison_Screen SHALL provide a mechanism to assess the feasibility of AI_Summary generation before full implementation

### Requirement 9: Boot Capacity Heuristic Model

**User Story:** As a developer implementing the boot visualizer, I want to cross-reference vehicle data with BabyDrive measurements, so that I can create accurate luggage capacity estimates.

#### Acceptance Criteria

1. THE Heuristic_Model SHALL identify vehicles present in both the application database and the BabyDrive_Database
2. THE Heuristic_Model SHALL extract boot capacity measurements from the BabyDrive_Database for matched vehicles
3. THE Heuristic_Model SHALL calculate a conversion ratio between boot litres and practical luggage capacity for matched vehicles
4. THE Heuristic_Model SHALL apply the calculated conversion ratio to vehicles not present in the BabyDrive_Database
5. THE Heuristic_Model SHALL define standard luggage units (large suitcase, pram, grocery bag) with approximate volume equivalents
6. THE Heuristic_Model SHALL generate luggage combination recommendations based on boot litre capacity
7. WHERE insufficient BabyDrive_Database matches exist, THE Heuristic_Model SHALL use industry-standard volume estimates for luggage units
8. THE Heuristic_Model SHALL store the conversion ratio and methodology for display in the Info_Button modal

### Requirement 10: Technical Term Glossary

**User Story:** As a content manager, I want to maintain a glossary of automotive technical terms with plain English explanations, so that users can understand complex specifications.

#### Acceptance Criteria

1. THE Application SHALL maintain a Technical_Term glossary stored in a structured data format
2. THE Technical_Term glossary SHALL include entries for Torque_Converter, Regenerative_Braking, ADAS, DOHC, VVT, and ABS
3. WHEN a new Technical_Term is added to the glossary, THE Application SHALL make it available for Tooltip display without code changes
4. THE Technical_Term glossary SHALL store both the term and its plain English explanation as key-value pairs
5. THE Technical_Term glossary SHALL support case-insensitive matching when identifying terms in specifications
6. THE Application SHALL provide a mechanism to update the Technical_Term glossary through configuration rather than code deployment

### Requirement 11: PWA Mobile Application Icon Update

**User Story:** As a mobile user installing the PWA to my home screen, I want to see the proper mobile application icon, so that the app is visually identifiable and professional on my device.

#### Acceptance Criteria

1. THE PWA_Manifest SHALL reference the mobile_app_icon.png file located at /images/logo/mobile_app_icon.png
2. THE Icon_Configuration SHALL include multiple size variants of the Mobile_App_Icon for optimal display across different mobile devices
3. THE Icon_Configuration SHALL specify size entries for 192x192 and 512x512 pixel dimensions as required by PWA standards
4. THE Icon_Configuration SHALL set the purpose attribute to "any maskable" for adaptive icon support on Android devices
5. THE PWA_Manifest SHALL retain the existing favicon.svg for browser tab display while using Mobile_App_Icon for installed app contexts
6. WHEN a user installs the PWA to their mobile device, THE Application SHALL display the Mobile_App_Icon on the home screen
7. THE Icon_Configuration SHALL specify "image/png" as the type attribute for all Mobile_App_Icon entries
