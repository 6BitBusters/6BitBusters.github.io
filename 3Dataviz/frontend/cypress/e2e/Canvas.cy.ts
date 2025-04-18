describe('Canvas', () => {
  beforeEach(() => {
    cy.visit('/'); // Assicurati che la tua app Three.js sia in esecuzione su questa URL
  });
  
  it('Carimamento del canvas', () => {
    cy.get('canvas').should('be.visible');
  })
})