Feature: SignUp User

  Scenario: Successfully get the user token
    Given a valid user with name, document, addres, email, password, confirmPassword
    Then the response status code should be 201
    And the response should be a JSON with the user id, name and access token

  Scenario: Fail to signup user by missing a property
    Given an user missing a property, like name, document, addres, email, password, confirmPassword...
    Then the response status code should be 400
    And the response should be a JSON with the error message Invalid.

  Scenario: Fail to signup user by invalid property
  Given an invalid property, like email, password, confirmPassword
  Then the response status code should be 400
  And the response should be a JSON with the error message Invalid.

  Scenario: Fail to signup user because email is already in use
  Given an invalid email that is already in use by other user
  Then the response status code should be 400