describe('Tạo bài tập mới', () => {
  beforeEach(() => {
    // Đăng nhập
    cy.visit('/auth/identity/login');
    cy.get('#username-input').type('admin');
    cy.get('#password-input').type('admin123');
    cy.contains('button', 'Đăng nhập').click();

    // Check đã vào trang list
    cy.url().should('include', '/exercise/exercise-layout/list');
  });

  it('Tạo bài tập thành công', () => {
    cy.fixture('exercise-data').then((exercise) => {
      // Mở modal
      cy.get('app-btn-type1').first().click();

      cy.get('.modal-content').should('be.visible');
      cy.contains('h2', 'Tạo bài tập mới').should('exist');

      // Step 1
      cy.get('#title').type(exercise.title);
      cy.get('#difficulty').select(exercise.difficulty);
      cy.get('#exerciseType').select(exercise.exerciseType);
      cy.get('#cost').clear().type(exercise.cost.toString());

      if (exercise.freeForOrg) {
        cy.get('input[formcontrolname="freeForOrg"]').check({ force: true });
      }
      if (exercise.visibility) {
        cy.get('input[formcontrolname="visibility"]').check({ force: true });
      }

      cy.contains('button', 'Tiếp tục').click();

      // Step 2
      cy.get('#description').type(exercise.description);
      cy.get('#orgId').type(exercise.orgId);
      cy.get('#startTime').type(exercise.startTime);
      cy.get('#endTime').type(exercise.endTime);
      cy.get('#duration').type(exercise.duration.toString());
      cy.get('#allowDiscussionId').type(exercise.allowDiscussionId);
      cy.get('#resourceIds').type(exercise.resourceIds);
      cy.get('#tags').type(exercise.tags);

      if (exercise.allowAiQuestion) {
        cy.get('input[formcontrolname="allowAiQuestion"]').check({
          force: true,
        });
      }

      cy.contains('button', 'Tạo mới').click();

      // ✅ Check modal đóng (không còn class open)
      cy.get('.modal-create-overlay').should('not.have.class', 'open');

      // ✅ Check notification thành công
      cy.get('app-notification-card')
        .should('contain.text', 'Tạo bài tập thành công!')
        .and('be.visible');
    });
  });
});
