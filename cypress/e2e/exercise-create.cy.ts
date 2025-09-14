/// <reference types="cypress" />

describe('Tạo bài tập mới', () => {
  beforeEach(() => {
    // Đăng nhập
    cy.visit('/auth/identity/login');
    cy.get('#username-input').type('admin');
    cy.get('#password-input').type('adminRoot123');
    cy.contains('button', 'Đăng nhập').click();

    // Chọn tab "Bài tập"
    cy.contains('a, button, li', 'Bài tập').click();
    cy.url().should('include', '/exercise/exercise-layout/list');
  });

  it('Tạo bài tập thành công', () => {
    cy.fixture('exercise-data').then((exercise) => {
      // Click nút "Tạo thủ công"
      cy.get('button[data-description="Tạo thủ công"]')
        .should('be.visible')
        .click();

      // Đợi modal hiển thị
      cy.get('app-exercise-modal').should('be.visible');

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

      // // 👉 Nếu có orgId trong data thì mới nhập và chọn, không thì bỏ qua
      // if (exercise.orgId && exercise.orgId.trim() !== '') {
      //   cy.get('#orgSearch').type(exercise.orgId);

      //   // Chọn tổ chức đầu tiên trong dropdown (force: true)
      //   cy.get('.dropdown-item').first().click({ force: true });

      //   // Kiểm tra đã chọn thành công
      //   cy.get('.selected-org').should('contain.text', exercise.orgId);
      // } else {
      //   cy.log('⚠️ Không có orgId trong fixture, bỏ qua bước chọn tổ chức');
      // }

      cy.get('#startTime').type(exercise.startTime);
      cy.get('#endTime').type(exercise.endTime);
      cy.get('#duration').type(exercise.duration.toString());

      // Nếu có field allowDiscussionId & resourceIds trong FE thì giữ lại
      // if (exercise.allowDiscussionId) {
      //   cy.get('#allowDiscussionId').type(exercise.allowDiscussionId);
      // }
      // if (exercise.resourceIds) {
      //   cy.get('#resourceIds').type(exercise.resourceIds);
      // }

      cy.get('#tags').type(exercise.tags);

      if (exercise.allowAiQuestion) {
        cy.get('input[formcontrolname="allowAiQuestion"]').check({
          force: true,
        });
      }

      // 👉 Click "Tạo mới"
      cy.contains('button', 'Tạo mới').click({ force: true });

      // // Check modal đóng
      // // Ổn định hơn
      // cy.get('app-exercise-modal input#title').should('not.exist');
      // // hoặc
      // cy.get('app-exercise-modal .modal-content').should(
      //   'not.have.class',
      //   'open'
      // );

      // Check notification thành công
      cy.get('app-notification-card')
        .should('contain.text', 'Tạo bài tập thành công!')
        .and('be.visible');
    });
  });
});
