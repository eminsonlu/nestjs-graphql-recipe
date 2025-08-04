import { Test, TestingModule } from '@nestjs/testing';
import { RatingService } from '../rating.service';
import { getModelToken } from '@nestjs/sequelize';
import { Rating } from '../../../models/rating.model';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

type MockRatingModel = {
  create: jest.Mock;
  findByPk: jest.Mock;
  destroy: jest.Mock;
};

describe('RatingService', () => {
  let service: RatingService;
  let mockRatingModel: MockRatingModel;

  const mockUser = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
  };

  const mockRating = {
    id: 1,
    rating: 5,
    comment: 'Great recipe!',
    userId: mockUser.id,
    recipeId: 1,
    user: mockUser,
  };

  beforeEach(async () => {
    mockRatingModel = {
      create: jest.fn(),
      findByPk: jest.fn(),
      destroy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatingService,
        {
          provide: getModelToken(Rating),
          useValue: mockRatingModel,
        },
      ],
    }).compile();

    service = module.get<RatingService>(RatingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createRating', () => {
    it('should create a rating and return it', async () => {
      const input = { rating: 5, comment: 'Great recipe!' };
      const recipeId = 1;
      const userId = mockUser.id;

      mockRatingModel.create.mockResolvedValue({ id: 1 });
      mockRatingModel.findByPk.mockResolvedValue(mockRating);

      const result = await service.createRating(input, recipeId, userId);

      expect(mockRatingModel.create).toHaveBeenCalledWith({
        ...input,
        recipeId,
        userId,
      });
      expect(mockRatingModel.findByPk).toHaveBeenCalledWith(1, {
        include: ['user', 'recipe'],
      });
      expect(result).toEqual(mockRating);
    });
  });

  describe('deleteRating', () => {
    it('should delete a rating if it belongs to the user', async () => {
      const ratingId = 1;
      const userId = mockUser.id;

      mockRatingModel.findByPk.mockResolvedValue({ userId: mockUser.id });
      mockRatingModel.destroy.mockResolvedValue(1);

      const result = await service.deleteRating(ratingId, userId);

      expect(mockRatingModel.findByPk).toHaveBeenCalledWith(ratingId);
      expect(mockRatingModel.destroy).toHaveBeenCalledWith({
        where: { id: ratingId },
      });
      expect(result).toBe(true);
    });

    it('should throw NotFoundException if rating does not exist', async () => {
      const ratingId = 999;
      const userId = mockUser.id;

      mockRatingModel.findByPk.mockResolvedValue(null);

      await expect(service.deleteRating(ratingId, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw UnauthorizedException if rating does not belong to user', async () => {
      const ratingId = 1;
      const userId = 999;

      mockRatingModel.findByPk.mockResolvedValue({ userId: mockUser.id });

      await expect(service.deleteRating(ratingId, userId)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
