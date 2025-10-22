const { expect } = require('chai');
const formatFullname = require('../utils/formatFullname');

describe('formatFullname', () => {
  it('powinno być funkcją', () => {
    expect(formatFullname).to.be.a('function');
  });

  describe('walidacja danych wejściowych', () => {
    it('zwraca "Error!" gdy argument nie jest stringiem', () => {
      expect(formatFullname(undefined)).to.equal('Error!');
      expect(formatFullname(null)).to.equal('Error!');
      expect(formatFullname(123)).to.equal('Error!');
      expect(formatFullname({})).to.equal('Error!');
    });

    it('zwraca "Error!" gdy nie ma dokładnie dwóch słów', () => {
      expect(formatFullname('Ala')).to.equal('Error!');
      expect(formatFullname('Ala ma kota')).to.equal('Error!');
      expect(formatFullname('')).to.equal('Error!');
    });
  });

  describe('poprawne formatowanie imienia i nazwiska', () => {
    it('poprawnie formatuje "john doe" → "John Doe"', () => {
      expect(formatFullname('john doe')).to.equal('John Doe');
    });

    it('ignoruje wielokrotne spacje i mieszaną wielkość liter', () => {
      expect(formatFullname('   aNNa    NOWaK  ')).to.equal('Anna Nowak');
    });

    it('działa też dla imion/nazwisk z dużych liter', () => {
      expect(formatFullname('JAN KOWALSKI')).to.equal('Jan Kowalski');
    });
  });
  describe('przypadki krawędziowe', () => {
    it('obsługuje polskie znaki (np. "ł", "ń")', () => {
      expect(formatFullname('żaneta NOWAK')).to.equal('Żaneta Nowak');
      expect(formatFullname('PIOTR zań')).to.equal('Piotr Zań');
    });

    it('obsługuje nazwiska z łącznikiem', () => {
      // oczekujemy kapitalizacji po każdej części
      expect(formatFullname('anna kowalska-nowak')).to.equal('Anna Kowalska-Nowak');
    });

    it('obsługuje apostrof w nazwisku', () => {
      expect(formatFullname("jan o'neill")).to.equal("Jan O'Neill");
    });
  });



});
