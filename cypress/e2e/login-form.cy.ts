/// <reference types="cypress" />

describe('Trang đăng nhập', () => {
  beforeEach(() => {
    cy.visit('/auth/identity/login');
  });

  it('Hiển thị đầy đủ form login', () => {
    cy.get('.login-container').should('be.visible');
    cy.get('#username-input').should('be.visible');
    cy.get('#password-input').should('be.visible');
    cy.contains('button', 'Đăng nhập').should('be.visible');
  });

  it('Đăng nhập thành công với tài khoản hợp lệ', () => {
    cy.get('#username-input').type('admin');
    cy.get('#password-input').type('adminRoot123');
    cy.contains('button', 'Đăng nhập').click();

    // ✅ sửa lại URL cho đúng thực tế
    cy.url().should('include', '/post-features/post-list');

    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.exist;
    });
  });

  it('Chuyển sang trang đăng ký khi click "Đăng ký"', () => {
    cy.contains('p', 'Đăng ký').click();
    cy.url().should('include', '/auth/identity/register');
  });

  context('Các trường hợp đăng nhập không hợp lệ', () => {
    beforeEach(() => {
      cy.fixture('invalid-logins').as('invalidCases');
    });

    it('Test tất cả case invalid từ fixture', function () {
      this.invalidCases.forEach((tc: any) => {
        // clear trước khi nhập
        cy.get('body').then(($body) => {
          if ($body.find('app-notification-card button.close-btn').length > 0) {
            cy.get('app-notification-card button.close-btn').click();
          }
        });

        cy.get('#username-input').clear();

        if (tc.accountName) {
          cy.get('#username-input').type(tc.accountName);
        }

        cy.get('#password-input').clear();
        if (tc.password) {
          cy.get('#password-input').type(tc.password);
        }

        cy.contains('button', 'Đăng nhập').click();

        // check message
        cy.contains(tc.expectedMessage).should('exist');
      });
    });
  });
});
