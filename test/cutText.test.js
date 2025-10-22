const { expect } = require('chai');
const cutText = require('../utils/cutText');

describe('cutText', () => {
  it('powinno być funkcją', () => {
    expect(cutText).to.be.a('function');
  });

  describe('walidacja argumentów', () => {
    it('zwraca "Error!" gdy text nie jest stringiem', () => {
      expect(cutText(undefined, 10)).to.equal('Error!');
      expect(cutText(null, 10)).to.equal('Error!');
      expect(cutText(123, 10)).to.equal('Error!');
      expect(cutText({}, 10)).to.equal('Error!');
    });

    it('zwraca "Error!" gdy maxLen nie jest liczbą lub <= 0', () => {
      expect(cutText('Ala ma kota', '10')).to.equal('Error!');
      expect(cutText('Ala ma kota', NaN)).to.equal('Error!');
      expect(cutText('Ala ma kota', 0)).to.equal('Error!');
      expect(cutText('Ala ma kota', -5)).to.equal('Error!');
    });
  });

  describe('zwraca oryginał gdy mieści się w limicie', () => {
    it('gdy długość == maxLen', () => {
      expect(cutText('Ala ma kota', 11)).to.equal('Ala ma kota'); // 11 znaków
    });
    it('gdy krótszy niż maxLen', () => {
      expect(cutText('Ala', 10)).to.equal('Ala');
    });
  });

  describe('przycinanie do całych słów + "..."', () => {
    it('tnie i dodaje "..." bez urywania słowa', () => {
      // maxLen 10, "Ala ma koty duże" -> powinno uciąć na "Ala ma" (5+1+2 = 8) i dodać "..."
      expect(cutText('Ala ma koty duże', 10)).to.equal('Ala ma...');
    });

    it('pomija wielokrotne spacje i nie zostawia trailing space przed "..."', () => {
      expect(cutText('  Ala   ma   kota   ', 9)).to.equal('Ala ma...');
    });

    it('gdy pierwszy wyraz już przekracza limit — zwraca "..." (nic nie zmieści się sensownie)', () => {
      expect(cutText('Superhiperwyraz', 5)).to.equal('...');
    });
  });
});
